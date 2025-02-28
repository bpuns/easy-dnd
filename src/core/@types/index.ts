import type { DropCore } from '../DropCore'
import type { DragCore } from '../DragCore'

/** 拖拽模式 */
enum DND_MODE {
  /** 范围模式 */
  SCOPE = 'scope',
  /** 自治模式（默认） */
  SWARAJ = 'swaraj'
}

type ListenQueue<Data, Rubbish> = Omit<IListenDragParams<Data, Rubbish>, 'context'> & { unbind: () => void }

/** 存储拖拽作用域下的所有数据 */
interface IDnDProvider<Data, Rubbish> {
  /** 拖拽格式 */
  dndMode: Readonly<DND_MODE>
  /** 正在拖拽元素的x与y点坐标 */
  dragCoord: Record<'x' | 'y', number>
  /** 正在拖拽元素的描述 */
  dragType: any
  /** 正在拖拽的元素的dom */
  dragDom: HTMLElement
  /** 用于阻止拖拽默认行为的dom，如果没有设置默认是 IDnDProvider.dragDom */
  dragPreventDom: HTMLElement
  /** 拖拽元素的data */
  dragData: Data
  /** 某个元素执行了drop，那么这个drop的实例就会存储在这里，在整个拖拽生命周期结束后，此变量也会被删除 */
  dropInstance: DropCore | null
  /** 某个元素开始拖拽，那么这个drag的实例就会存储在这里，在整个拖拽生命周期结束后，此变量也会被删除 */
  dragInstance: DragCore | null
  /** 保存当前dragEnter的dom是哪一个 */
  enterDom: HTMLElement
  /** dragEnter延时多长事件触发 */
  delay: number
  /** 获取 存放拖拽的时候具体业务逻辑中的一些数据 */
  getRubbish: () => Rubbish
  /** 用于销毁上下文下的所有drag/drop对象 */
  destroy: () => void
  /** 用来存储被drag包裹的元素的开始事件，当有元素开始拖动的时候，会触发此方法 */
  _dragItemDragStarts: Set<() => void>
  /** 用来存储被drop包裹的元素的结束事件，当有元素结束拖动的时候，会触发此方法 */
  _dragItemDragEnds: Set<() => void>
  /** 用来存储被drop包裹的元素的开始事件，当有元素开始拖动的时候，会触发此方法 */
  _dropItemDragStarts: Set<() => void>
  /** 用来存储被drop包裹的元素的结束事件，当有元素结束拖动的时候，会触发此方法 */
  _dropItemDragEnds: Set<() => void>
  /** 存储当前上下文下所有drop实例 */
  _drops: Set<DropCore>
  /** 存储当前上下文下所有drag实例 */
  _drags: Set<DragCore>
  /** 存储拖拽监听 */
  _dragListen: {
    /** 存储拖拽中的要触发的dragging */
    _ing: ListenQueue<Data, Rubbish>[]
    /** 存储绑定的监听拖拽函数 */
    _queue: ListenQueue<Data, Rubbish>[]
  }
}

/** Drag 构造函数参数 */
interface IDragCoreConstructorParams<Data, Rubbish> {
  /** 拖动开始触发的方法 */
  dragStart?: (
    monitor: IDragCoreMonitor<Data, Rubbish>,
    context: IDnDProvider<Data, Rubbish>,
    dragInstance: DragCore<Data, Rubbish>
  ) => any
  /** 拖动中触发的方法 */
  drag?: (
    monitor: IDragCoreMonitor<Data, Rubbish>,
    context: IDnDProvider<Data, Rubbish>,
    dragInstance: DragCore<Data, Rubbish>
  ) => any
  /** 拖动结束触发的方法 */
  dragEnd?: (
    monitor: IDragCoreMonitor<Data, Rubbish>,
    context: IDnDProvider<Data, Rubbish>,
    dragInstance: DragCore<Data, Rubbish>
  ) => any
  /** 鼠标移入触发的方法 */
  hover?: (
    monitor: IDragCoreMonitor<Data, Rubbish>,
    context: IDnDProvider<Data, Rubbish>,
    dragInstance: DragCore<Data, Rubbish>
  ) => any
  /** 鼠标移开触发的方法 */
  leave?: (
    monitor: IDragCoreMonitor<Data, Rubbish>,
    context: IDnDProvider<Data, Rubbish>,
    dragInstance: DragCore<Data, Rubbish>
  ) => any
  /** 配置 */
  config: {
    /** 当前拖拽元素的类型 */
    type: IDnDProvider<Data, Rubbish>['dragType']
    /** 拖拽元素携带的数据 */
    data?: () => Data
    /** 动态添加的className */
    className?: {
      /** 鼠标移入的时候添加的className */
      hover?: string,
      /** 该元素拖拽中触发添加的className */
      dragging?: string
    }
    /** 获取阻止默认行为的节点dom，默认是 dragInstance.dragDom */
    getPreventDom?: (monitor: IDragCoreMonitor<Data, Rubbish>, context: IDnDProvider<Data, Rubbish>) => HTMLElement | null
    /** 设置默认是否允许拖拽   true 允许拖拽 | false 不允许拖拽，默认是true */
    defaultDraggable?: boolean
    /** 拖拽作用域 */
    context: IDnDProvider<Data, Rubbish>
  }
}

/** Drag Monitor */
interface IDragCoreMonitor<Data, Rubbish> extends Pick<IDnDProvider<Data, Rubbish>, 'getRubbish'> {
  /** 当前正在拖拽的元素 */
  dragDom: HTMLElement;
  /** 拖拽事件对象 */
  event: Event
  /** 获取dnd上下文 */
  getContext: () => IDnDProvider<Data, Rubbish>
}

/** Drop 构造函数参数 */
interface IDropCoreConstructorParams<Data, Rubbish> {
  /** 外部元素进入this元素触发的方法 */
  dragEnter?: (
    monitor: IDropCoreMonitor<Data, Rubbish>,
    context: IDnDProvider<Data, Rubbish>,
    dropInstance: DropCore<Data, Rubbish>
  ) => any
  /** 外部元素在this元素中移动触发的方法 */
  dragOver?: (
    monitor: IDropCoreMonitor<Data, Rubbish>,
    context: IDnDProvider<Data, Rubbish>,
    dropInstance: DropCore<Data, Rubbish>
  ) => any
  /** 外部元素离开this元素触发的方法 */
  dragLeave?: (
    monitor: IDropCoreMonitor<Data, Rubbish>,
    context: IDnDProvider<Data, Rubbish>,
    dropInstance: DropCore<Data, Rubbish>
  ) => any
  /** 外部元素放置到this元素触发的方法 */
  drop?: (
    monitor: IDropCoreMonitor<Data, Rubbish>,
    context: IDnDProvider<Data, Rubbish>,
    dropInstance: DropCore<Data, Rubbish>
  ) => any
  /** acceptType里允许接收的元素开始拖拽的时候，会触发此方法 */
  dragStart?: (
    monitor: IDropCoreMonitor<Data, Rubbish>,
    context: IDnDProvider<Data, Rubbish>,
    dropInstance: DropCore<Data, Rubbish>
  ) => any
  /** acceptType里允许接收的元素结束拖拽的时候，会触发此方法 */
  dragEnd?: (
    monitor: IDropCoreMonitor<Data, Rubbish>,
    context: IDnDProvider<Data, Rubbish>,
    dropInstance: DropCore<Data, Rubbish>
  ) => any
  /** 配置 */
  config: {
    /**
     * 验证是否允许放置在这里
     * ！！！注意！！！
     * 请不要在canDrop中去做一些判断位置的操作
     * 在这个函数在整个拖拽生命周期内返回的值必须是一样的
     */
    canDrop?: (
      monitor: Pick<
        IDropCoreMonitor<Data, Rubbish>,
        'event' |
        'getContext' |
        'getDragData' |
        'getDragType' |
        'getDropInstance'
      >
    ) => boolean
    /** 在这里配置允许接收的元素的类型 */
    acceptType: Set<IDnDProvider<Data, Rubbish>['dragType']>
    /** 动态添加的className */
    className?: {
      /** 允许放置的元素进入添加的className */
      dragEnter?: string,
      /** 允许放置的元素开始拖拽添加的className */
      canDrop?: string
    }
    /** 上下文 */
    context: IDnDProvider<Data, Rubbish>
  }
}

interface IDropCoreMonitor<Data, Rubbish> extends Pick<IDnDProvider<Data, Rubbish>, 'getRubbish'> {
  /** 获取dropDom的尺寸 */
  getDomRect: () => DOMRect
  /** 拖拽事件对象 */
  event: Event
  /** 获取整个dnd的上下文 */
  getContext: () => IDnDProvider<Data, Rubbish>
  /** 获取正在拖拽的元素的type */
  getDragType: () => IDnDProvider<Data, Rubbish>['dragType']
  /** 获取正在拖拽的元素的dom */
  getDragDom: () => IDnDProvider<Data, Rubbish>['dragDom']
  /** 获取拖拽元素的data */
  getDragData: () => IDnDProvider<Data, Rubbish>['dragData']
  /** 获取dropInstance */
  getDropInstance: () => IDnDProvider<Data, Rubbish>['dropInstance']
  /**
   * 判断dragDom是否在dropDom的上侧区域
   * @param domRect        DOMRect
   * @param middleExists   false|鼠标在上50%的位置就返回true(默认值)  true|鼠标在上33.333%的位置就返回true
   */
  isOverTop: (domRect?: DOMRect, middleExists?: boolean) => boolean
  /**
   * 判断dragDom是否在dropDom的下侧区域
   * @param domRect        DOMRect
   * @param middleExists   false|鼠标在下50%的位置就返回true(默认值)  true|鼠标在下33.333%的位置就返回true
   */
  isOverBottom: (domRect?: DOMRect, middleExists?: boolean) => boolean
  /**
   * 判断dragDom是否在dropDom的左侧区域
   * @param domRect        DOMRect
   * @param middleExists   false|鼠标在左50%的位置就返回true(默认值)  true|鼠标在左33.333%的位置就返回true
   */
  isOverLeft: (domRect?: DOMRect, middleExists?: boolean) => boolean
  /**
   * 判断dragDom是否在dropDom的右侧区域
   * @param domRect        DOMRect
   * @param middleExists   false|鼠标在右50%的位置就返回true(默认值)  true|鼠标在右33.333%的位置就返回true
   */
  isOverRight: (domRect?: DOMRect, middleExists?: boolean) => boolean
  /** 判断正在拖拽的元素是否在横向的 > 33.333% & < 66.666% 位置 */
  isOverRowCenter: (domRect?: DOMRect) => boolean
  /** 判断正在拖拽的元素是否在纵向的 > 33.333% & < 66.666% 位置 */
  isOverColumnCenter: (domRect?: DOMRect) => boolean
}

abstract class DragDropBase<Data, Rubbish> {

  /** 记录上一次dragover/drag的clientX与clientY的位置，避免重复执行dragOver | drag */
  prePosition: { x: number, y: number } = { x: null!, y: null! }
  /** 拖拽上下文 */
  context!: IDnDProvider<Data, Rubbish>

  /**
   * 执行监听函数
   * @param execName  监听函数名称
   */
  _execListen = (execName: keyof ListenQueue<Data, Rubbish>, ctx: IDnDProvider<Data, Rubbish>) => {
    // @ts-ignore monitor一定是正确的
    ctx._dragListen._ing.forEach(t => t?.[execName]?.(this.monitor, ctx))
  }

  /** 注册dom */
  abstract registerDom: (dom: HTMLElement) => any
  /** 绑定事件 */
  abstract subscribe: () => void
  /** 取消绑定事件 */
  abstract unSubscribe: () => void

}

/** 把context取出、来，hooks中不需要加入context */
type IDragHooksParams<Data, Rubbish> = Omit<IDragCoreConstructorParams<Data, Rubbish>, 'config'> & {
  config: Omit<IDragCoreConstructorParams<Data, Rubbish>['config'], 'context'>
}

type IDropHooksParams<Data, Rubbish> = Omit<IDropCoreConstructorParams<Data, Rubbish>, 'config'> & {
  config: Omit<IDropCoreConstructorParams<Data, Rubbish>['config'], 'context'>
}

/** 监听拖拽参数 */
type IListenDragParams<Data, Rubbish> = {
  /** 拖拽上下文 */
  context: IDnDProvider<Data, Rubbish>
  /** 此次拖拽是否需要监听 */
  filter?: (ctx: IDnDProvider<Data, Rubbish>) => void
}
  & Pick<IDragCoreConstructorParams<Data, Rubbish>, 'dragStart' | 'drag' | 'dragEnd'>
  & Pick<IDropCoreConstructorParams<Data, Rubbish>, 'dragEnter' | 'dragOver' | 'dragLeave' | 'drop'>

/** 监听hooks构子 */
type IListenDragHooksParams<Data, Rubbish> = Omit<IListenDragParams<Data, Rubbish>, 'context'>;

export {
  DND_MODE,
  DragDropBase
}

export type {
  IDnDProvider,
  IDragCoreMonitor,
  IDropCoreMonitor,
  IDragHooksParams,
  IDropHooksParams,
  IListenDragParams,
  IListenDragHooksParams,
  IDragCoreConstructorParams,
  IDropCoreConstructorParams
}