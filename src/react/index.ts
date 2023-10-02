import {
  useMemo,
  useEffect,
  createElement,
  useContext,
  createContext,
  PureComponent,
  useLayoutEffect
} from 'react'
import {
  type IDnDProvider,
  type IDragCoreConstructorParams,
  type IDropCoreConstructorParams,
  type IDragHooksParams,
  type IDropHooksParams,
  DND_MODE,
  DragCore,
  DropCore,
  createProvider
} from 'easy-dnd'

/** dnd上下文 */
const DndContext = createContext<IDnDProvider<any, any>>(null!)

interface IDndProviderProps {
  /** 拖拽类型 */
  type?: IDnDProvider<any, any>['dndMode']
  /** 延时多久触发dragenter */
  delay?: IDnDProvider<any, any>['delay']
  /** react子节点 */
  children: any
}

class DndProvider extends PureComponent<IDndProviderProps> {

  /** 每个Dnd下都有属于自己的上下文, 里面可以存储一些基本的拖拽数据 */
  dndCtx!: IDnDProvider<any, any>

  constructor(props: IDndProviderProps) {
    super(props)
    this.dndCtx = createProvider(props.type || DND_MODE.SWARAJ, props.delay || 0)
  }

  render() {
    return (
      createElement(
        DndContext.Provider,
        {
          value:    this.dndCtx,
          children: this.props.children
        }
      )
    )
  }

}

class Drag<Data = any, Rubbish = any> extends DragCore<Data, Rubbish> {

  /** 给hooks用，标识是否第一次渲染 */
  hooksFirst = true

  dragRef = (dom: HTMLElement | null) => {
    this.dragDom = dom!
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

  const dragInstance = useMemo(() => {
    // 手动注入context
    const params = operate()
    params.config['context'] = context
    return new Drag(params as IDragCoreConstructorParams<Data, Rubbish>)
  }, [])

  // 解决闭包问题
  useEffect(() => {
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
    dragInstance.subscribe()
    return () => dragInstance.unSubscribe()
  }, [])

  return dragInstance

}

const dropEvent = [ 'dragStart', 'dragEnd', 'drop', 'dragEnter', 'dragOver', 'dragLeave' ]

function useDrop<Data = {}, Rubbish = {}>(
  operate: () => IDropHooksParams<Data, Rubbish>,
  deep: any[] = _deep
): Drop<Data, Rubbish> {

  const context = useContext(DndContext)

  const dropInstance = useMemo<Drop<Data, Rubbish>>(() => {
    // 手动注入context
    const params = operate()
    params.config['context'] = context
    return new Drop(params as IDropCoreConstructorParams<Data, Rubbish>)
  }, [])

  // 解决闭包问题
  useEffect(() => {
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
    dropInstance.subscribe()
    return () => dropInstance.unSubscribe()
  }, [])

  return dropInstance

}

export {
  useDrag,
  useDrop,
  DndProvider
}