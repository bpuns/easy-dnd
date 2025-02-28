import {
  useRef,
  useEffect,
  useContext,
  createElement,
  createContext,
  useLayoutEffect
} from 'react'
import {
  type IDnDProvider,
  type IListenDragHooksParams,
  type IDragCoreConstructorParams,
  type IDropCoreConstructorParams,
  type IDragHooksParams,
  type IDropHooksParams,
  DragCore,
  DropCore,
  onListenDrag,
  createProvider
} from 'easy-dnd'

/** dnd上下文 */
const DndContext = createContext<IDnDProvider<any, any>>(null!)

/** 判断值是否为空 */
export const isNull = (v: ReturnType<typeof useRef>) => v.current === null

interface IDndProviderProps {
  /** 拖拽类型 */
  type?: IDnDProvider<any, any>['dndMode']
  /** 延时多久触发dragenter */
  delay?: IDnDProvider<any, any>['delay']
  /** react子节点 */
  children: any
}

function DndProvider(props: IDndProviderProps) {

  /** 每个Dnd下都有属于自己的上下文, 里面可以存储一些基本的拖拽数据 */
  const dndCtx = useRef<IDnDProvider<any, any>>()

  if (!dndCtx.current) {
    dndCtx.current = createProvider(props)
  }

  return (
    createElement(
      DndContext.Provider,
      {
        value:    dndCtx.current,
        children: props.children
      }
    ) as unknown as JSX.Element
  )

}

class Drag<Data = any, Rubbish = any> extends DragCore<Data, Rubbish> {

  /** 给hooks用，标识是否第一次渲染 */
  hooksFirst = true

  dragRef = (dom: HTMLElement | null) => {
    this.registerDom(dom!)
    return dom
  }

}

class Drop<Data = any, Rubbish = any> extends DropCore<Data, Rubbish> {

  /** 给hooks用，标识是否第一次渲染 */
  hooksFirst = true

  public dropRef = (forwardRef: HTMLElement | null | Drag<any, any>['dragRef']) => {
    if (typeof forwardRef === 'function') {
      return (dom: HTMLElement | null) => {
        this.registerDom((forwardRef as Drag<any, any>['dragRef'])(dom)!)
      }
    }
    this.registerDom(forwardRef!)
  }

}

const _deep: any[] = []

const dragEvent = [ 'dragStart', 'dragEnd', 'drag' ]

function useDrag<Data = {}, Rubbish = {}>(
  operate: () => IDragHooksParams<Data, Rubbish>,
  deep: any[] = _deep
): Drag<Data, Rubbish> {

  const context = useContext(DndContext)
  const dragDom = useRef<HTMLElement>(null!)

  const _dragInstance = useRef<Drag<Data, Rubbish>>(null!)

  // 解决在Suspense中，useMemo会重复调用的问题
  if (isNull(_dragInstance)) {
    // 手动注入context
    const params = operate()
    params.config['context'] = context
    _dragInstance.current = new Drag(params as IDragCoreConstructorParams<Data, Rubbish>)
  }

  // 解决闭包问题
  useEffect(() => {
    const dragInstance = _dragInstance.current
    if (dragInstance.hooksFirst) {
      dragInstance.hooksFirst = false
    } else {
      const { params } = dragInstance
      const currentOperate = operate()
      for (let event of dragEvent) {
        params[event] && (params[event] = currentOperate[event])
      }
      params.config.data = currentOperate.config.data
    }
  }, deep)

  useLayoutEffect(() => {
    const dragInstance = _dragInstance.current
    if (dragInstance.dragDom === null) {
      dragInstance.dragDom = dragDom.current
    }
    dragDom.current = dragInstance.dragDom
    dragInstance.subscribe()
    return () => dragInstance.unSubscribe()
  }, [])

  return _dragInstance.current

}

const dropEvent = [ 'dragStart', 'dragEnd', 'drop', 'dragEnter', 'dragOver', 'dragLeave' ]

function useDrop<Data = {}, Rubbish = {}>(
  operate: () => IDropHooksParams<Data, Rubbish>,
  deep: any[] = _deep
): Drop<Data, Rubbish> {

  const context = useContext(DndContext)
  const dropDom = useRef<HTMLElement>(null!)
  const _dropInstance = useRef<Drop<Data, Rubbish>>(null!)

  // 解决在Suspense中，useMemo会重复调用的问题
  if (isNull(_dropInstance)) {
    // 手动注入context
    const params = operate()
    params.config['context'] = context
    _dropInstance.current = new Drop(params as IDropCoreConstructorParams<Data, Rubbish>)
  }

  // 解决闭包问题
  useEffect(() => {
    const dropInstance = _dropInstance.current
    if (dropInstance.hooksFirst) {
      dropInstance.hooksFirst = false
    } else {
      const { params } = dropInstance
      const currentOperate = operate()
      for (let event of dropEvent) {
        params[event] && (params[event] = currentOperate[event])
      }
      params.config.canDrop = currentOperate.config.canDrop
    }
  }, deep)

  useLayoutEffect(() => {
    const dropInstance = _dropInstance.current
    if (dropInstance.dropDom === null) {
      dropInstance.dropDom = dropDom.current
    }
    dropDom.current = dropInstance.dropDom
    dropInstance.subscribe()
    return () => dropInstance.unSubscribe()
  }, [])

  return _dropInstance.current

}

const listenEvent = [ ...dropEvent, dragEvent[2], 'filter' ]

function useDragListen<Data = {}, Rubbish = {}>(
  operate: () => IListenDragHooksParams<Data, Rubbish>,
  deep: any[] = _deep
) {

  const context = useContext(DndContext)
  const _listenInstance = useRef<ReturnType<typeof onListenDrag>>(null!)

  // 解决闭包问题
  useEffect(() => {
    // 第一次创建
    if (isNull(_listenInstance)) {
      // 手动注入context
      const params = operate()
      // @ts-ignore 手动筛选掉，实际上有context
      params.context = context
      // @ts-ignore 一定有context
      _listenInstance.current = onListenDrag(params)
    }
    // 依赖发生变化
    else {
      const listenInstance = _listenInstance.current
      const currentOperate = operate()
      for (let event of listenEvent) {
        listenInstance[event] && (listenInstance[event] = currentOperate[event])
      }
    }
  }, deep)

  useEffect(() => {
    const listenInstance = _listenInstance.current
    return () => {
      _listenInstance.current = null!
      listenInstance.unbind()
    }
  }, [])

}

function useDnd<Rubbish>(){
  return useContext(DndContext) as IDnDProvider<any, Rubbish>
}

export * from 'easy-dnd'

export {
  Drag,
  Drop,
  useDnd,
  useDrag,
  useDrop,
  DndProvider,
  useDragListen
}