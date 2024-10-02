import {
  type IDnDProvider,
  type IDragCoreMonitor,
  type IDropCoreMonitor,
  type IListenDragParams,
  DND_MODE
} from '../@types'
import type { DragCore } from '../DragCore'
import type { DropCore } from '../DropCore'
import {
  spliceItem,
  DESTROY_TIP,
  bindGetContextCoords
} from './private'

/** 拖拽上下文的key */
export const DND_CTX = Symbol('easy-dnd')

/**
 * 验证元素是否是HtmlElement
 * @param dom 
 * @returns 
 */
export function isElement(dom: unknown): dom is HTMLElement {
  return dom instanceof HTMLElement
}

interface ProviderConfig {
  /** 拖拽类型，有 SCOPE 和 SWARAJ 两种可选 */
  dndMode?: DND_MODE,
  /** 拖拽延时时间，必须大于等于0 */
  delay?: number
}

/**
 * 创建拖拽作用域下的基本数据
 * @param {ProviderConfig} param
 * @returns 
 */
export function createProvider<Data, Rubbish>({ dndMode = DND_MODE.SWARAJ, delay = 0 }: ProviderConfig = {}) {
  if (delay < 0 || isNaN(delay)) delay = 0
  const rubbish: any = {}
  const dragCoord = Object.seal({
    x: 0,
    y: 0
  })
  // TIP: 
  const unbind = bindGetContextCoords(dragCoord)
  const ctx: Partial<IDnDProvider<Data, Rubbish>> = {
    dndMode,
    delay,
    // dragCoord,
    dropInstance: null,
    dragInstance: null,
    dragType:     null!,
    dragDom:      null!,
    dragData:     null!,
    enterDom:     null!,
    destroy() {
      unbind()
      ctx._drops.forEach(t => t.unSubscribe())
      ctx._drags.forEach(t => t.unSubscribe())
      Object.keys(ctx).forEach(k => {
        ctx[k] = null
      })
    },
    getRubbish:          () => rubbish,
    _drops:              new Set,
    _drags:              new Set,
    _dragItemDragStarts: new Set,
    _dragItemDragEnds:   new Set,
    _dropItemDragStarts: new Set,
    _dropItemDragEnds:   new Set,
    _dragListen:         {
      _ing:   null!,
      _queue: []
    }
  }
  Object.defineProperty(ctx, 'dragCoord', {
    value:        dragCoord,
    writable:     false,
    configurable: false
  })
  return ctx as IDnDProvider<Data, Rubbish>
}

/**
 * 创建拖拽监听
 * @param {ProviderConfig} param 
 * @returns 
 */
export function onListenDrag<Data, Rubbish>({ context, filter = () => true, ...events }: IListenDragParams<Data, Rubbish>) {
  // 获取存储拖拽监听的任务队列
  const queue = context?._dragListen?._queue
  if (!Array.isArray(queue)) throw new Error(DESTROY_TIP)
  const queueItem: (typeof queue)[number] = {
    ...events,
    filter,
    unbind: () => spliceItem(queue, queueItem)
  }
  queue.push(queueItem)
  return queueItem
}

/**
 * 创建拖拽事件中间对象
 * @param instance 拖拽实例
 * @returns 
 */
export function createDragMonitor<Data, Rubbish>(instance: DragCore<Data, Rubbish>): IDragCoreMonitor<Data, Rubbish> {
  const getCtx = () => instance.context
  return {
    event:      null!,
    dragDom:    null!,
    getContext: getCtx,
    getRubbish: () => getCtx().getRubbish()
  }
}

/**
 * 创建drop事件中间对象
 * @param instance 
 * @returns 
 */
export function createDropMonitor<Data, Rubbish>(instance: DropCore<Data, Rubbish>): IDropCoreMonitor<Data, Rubbish> {

  const getDomRect = () => instance.dropDom.getBoundingClientRect()

  const getCtx = () => instance.context

  const canDropMonitor = {
    event:           null!,
    getContext:      getCtx,
    getDropInstance: () => getCtx().dropInstance,
    getDragType:     () => getCtx().dragType,
    getDragData:     () => getCtx().dragData
  }

  return {
    ...canDropMonitor,
    getDragDom: () => getCtx().dragDom,
    getDomRect,
    isOverTop:  (domRect?: DOMRect, middleExists?: boolean) => {
      const { y, height } = domRect || getDomRect()
      // console.log(getCtx().dragCoord)
      return getCtx().dragCoord.y < (y + height / (middleExists ? 3 : 2))
    },
    isOverBottom: (domRect?: DOMRect, middleExists?: boolean) => {
      const { y, height } = domRect || getDomRect()
      return getCtx().dragCoord.y > (y + height / (middleExists ? 1.5 : 2))
    },
    isOverLeft: (domRect?: DOMRect, middleExists?: boolean) => {
      const { x, width } = domRect || getDomRect()
      return getCtx().dragCoord.x < (x + width / (middleExists ? 3 : 2))
    },
    isOverRight: (domRect?: DOMRect, middleExists?: boolean) => {
      const { x, width } = domRect || getDomRect()
      return getCtx().dragCoord.x > (x + width / (middleExists ? 1.5 : 2))
    },
    isOverRowCenter(domRect?: DOMRect) {
      domRect = domRect || getDomRect()
      return !this.isOverTop(domRect, true) && !this.isOverBottom(domRect, true)
    },
    isOverColumnCenter(domRect?: DOMRect) {
      domRect = domRect || getDomRect()
      return !this.isOverLeft(domRect, true) && !this.isOverRight(domRect, true)
    },
    getRubbish: () => getCtx().getRubbish(),
    // @ts-ignore 给这个库自己用的
    _s:         canDropMonitor
  }
}