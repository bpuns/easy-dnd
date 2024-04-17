import {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo
} from 'react'
import {
  type IDnDProvider,
  type DropCore,
  useDrag,
  useDrop,
  DndProvider,
  useDragListen
} from 'easy-dnd/react'
import './example6.css'

export function Example6() {
  return (
    <DndProvider>
      <Layer />
    </DndProvider>
  )
}

function Layer() {

  const [ listen, setListen ] = useState(true)
  // 拿到目标节点的实例
  const targetDomRef = useRef<{ drop: DropCore }>(null!)
  // 存储拖拽过程图层
  const layerDom = useRef<HTMLDivElement>(null!)

  const s = useMemo(() => {

    // 缩放倍率 拖拽盒子是 50px * 50px  目标盒子是 200px * 200px
    const scale = 4

    return new class {

      /** 拖拽的原始的dom节点 */
      dragDom!: HTMLDivElement
      /** 拷贝了一份的拖拽节点 */
      cloneDragDom!: HTMLDivElement
      /** 拖拽节点最开始的Rect */
      startRect!: DOMRect
      /** 获取目标节点的盒子模型尺寸 */
      targetRect!: DOMRect
      /** 存储拖拽过程修改transform字符函数 */
      setTransformStr!: (draggingCoord: Record<'x' | 'y', number>) => any

      /**
       * 创建拖拽过程 transform 变化函数
       * @param context
       * @param cloneDragDom
       */
      createSetTransformStr = (context: IDnDProvider<any, any>, cloneDragDom: HTMLDivElement) => {
        /** 存储目标节点的dom */
        const targetDom = targetDomRef.current.drop.dropDom as HTMLDivElement
        this.targetRect = targetDom.getBoundingClientRect()
        const /** 拖拽起始点的x点 */
          startX = context.dragCoord.x,
          /** 拖拽起始点的y点 */
          startY = context.dragCoord.y,
          /** 获取目标节点的盒子模型尺寸 */
          /** 开始拖拽的时候，目标节点和拖拽节点的距离 */
          startDistance = calculateDistance(
            ...getRectCenterPoint(this.targetRect),
            ...getRectCenterPoint(this.startRect)
          )

        /** 斜率 (y2 - y1) / (x2 - x1) */
        const k = (1 - scale) / (startDistance - 0)
        /** 截距 */
        const b = scale - k * 0

        /**
         * 计算两个正方形盒子模型的中心点
         * @param rect
         */
        function getRectCenterPoint(rect: DOMRect): [number, number] {
          return [ (rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2 ]
        }

        /**
         * 计算直角坐标系上任意两点之间的距离
         */
        function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
          const deltaX = x2 - x1
          const deltaY = y2 - y1
          const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
          return distance
        }

        /**
         * 计算缩放比（已知斜率和截距，传入x，获取y）
         * @param x
         */
        function getScale(x: number) {
          return x * k + b
        }

        /**
         * 获取transform字符串
         * @param draggingCoord 拖拽中的指针位置
         */
        const setTransformStr = (draggingCoord: Record<'x' | 'y', number>) => {
          const [ currentX, currentY ] = [ draggingCoord.x, draggingCoord.y ]
          const translateX = this.startRect.x + currentX - startX
          const translateY = this.startRect.y + currentY - startY
          const scale = getScale(
            calculateDistance(
              ...getRectCenterPoint(this.targetRect),
              ...getRectCenterPoint(cloneDragDom.getBoundingClientRect())
            )
          )
          cloneDragDom.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
        }

        return setTransformStr
      }

    }

  }, [])

  useDragListen(() => ({
    filter: () => listen,
    dragStart(_, context) {

      // 存储拖拽dom
      s.dragDom = context.dragDom as HTMLDivElement
      // 获取初始Rect
      s.startRect = s.dragDom.getBoundingClientRect()
      // 克隆一份
      s.cloneDragDom = s.dragDom.cloneNode(true) as HTMLDivElement
      // 添加dom到图层上
      layerDom.current.appendChild(s.cloneDragDom)

      // 获取设置偏移的函数
      s.setTransformStr = s.createSetTransformStr(context, s.cloneDragDom)

      // 设置克隆dom的初始化设置
      s.cloneDragDom.style.transform = `translate(${s.startRect.x}px, ${s.startRect.y}px)`

      s.dragDom.classList.add('example6-hide')
    },
    drag(_, { dragCoord }) {
      s.setTransformStr(dragCoord)
    },
    dragEnd() {
      const { startRect, cloneDragDom } = s
      cloneDragDom.classList.add('example6-reset-animation')
      cloneDragDom.style.transform = `translate(${startRect.x}px, ${startRect.y}px)`
      cloneDragDom.ontransitionend = () => {
        // 还原样式
        layerDom.current.innerHTML = ''
        s.dragDom.classList.remove('example6-hide')
      }
    }
  }), [ listen ])

  return (
    <>
      <button onClick={() => setListen(!listen)}>
        {listen ? '关闭自定义layer' : '开启自定义layer'}
      </button>
      <div className='example6-container'>
        <A />
        <B ref={targetDomRef} />
      </div>
      <div className='example6-layer' ref={layerDom} />
    </>
  )
}

function A() {

  const drag = useDrag(() => ({
    config: {
      type: 'A'
    }
  }))

  return (
    <div ref={drag.dragRef} className='example6-dragItem'>
      盒子A
    </div >
  )
}

const B = forwardRef<{ drop: DropCore }>((_, ref) => {

  const drop = useDrop(() => ({
    config: {
      acceptType: new Set([ 'A' ])
    }
  }))

  useImperativeHandle(ref, () => ({ drop }), [])

  return (
    <div
      className='example6-dropItem'
      ref={drop.dropRef}
    />
  )

})

Example6.tip = '拖拽蒙版'