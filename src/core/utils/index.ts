import {
  type IDragCoreMonitor,
  type IDropCoreMonitor,
  type IDnDProvider,
  DND_MODE
} from '../@types'
import type { DragCore } from '../DragCore'
import type { DropCore } from '../DropCore'

/** 判断是否绑定了拖拽 */
export const BIND_DRAG = '_bp_bindDrag'
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

/**
 * 创建拖拽事件对象
 * @param instance 
 * @returns 
 */
export function createDropMonitor<Data, Rubbish>(instance: DropCore<Data, Rubbish>): IDropCoreMonitor<Data, Rubbish> {

  const getDomRect = () => instance.dropDom.getBoundingClientRect()

  const canDropMonitor = {
    event:           null!,
    getContext:      () => instance.context,
    getDropInstance: () => instance.context.dropInstance,
    getDragType:     () => instance.context.dragType,
    getDragData:     () => instance.context.dragData
  }

  return {
    ...canDropMonitor,
    getDragDom: () => instance.context.dragDom,
    getDomRect,
    isOverTop:  (domRect?: DOMRect, middleExists?: boolean) => {
      const { y, height } = domRect || getDomRect()
      return instance.context.dragCoord.y < (y + height / (middleExists ? 3 : 2))
    },
    isOverBottom: (domRect?: DOMRect, middleExists?: boolean) => {
      const { y, height } = domRect || getDomRect()
      return instance.context.dragCoord.y > (y + height / (middleExists ? 1.5 : 2))
    },
    isOverLeft: (domRect?: DOMRect, middleExists?: boolean) => {
      const { x, width } = domRect || getDomRect()
      return instance.context.dragCoord.x < (x + width / (middleExists ? 3 : 2))
    },
    isOverRight: (domRect?: DOMRect, middleExists?: boolean) => {
      const { x, width } = domRect || getDomRect()
      return instance.context.dragCoord.x > (x + width / (middleExists ? 1.5 : 2))
    },
    isOverRowCenter(domRect?: DOMRect) {
      domRect = domRect || getDomRect()
      return !this.isOverTop(domRect, true) && !this.isOverBottom(domRect, true)
    },
    isOverColumnCenter(domRect?: DOMRect) {
      domRect = domRect || getDomRect()
      return !this.isOverLeft(domRect, true) && !this.isOverRight(domRect, true)
    },
    // @ts-ignore 给这个库自己用的
    _s: canDropMonitor
  }
}

interface ProviderConfig {
  /** 拖拽类型，有 SCOPE 和 SWARAJ 两种可选 */
  dndMode?: DND_MODE,
  /** 拖拽延时时间，必须大于等于0 */
  delay?:   number
}

/**
 * 创建拖拽作用域下的基本数据
 * @param {ProviderConfig} param
 * @returns 
 */
export function createProvider<Data, Rubbish>({ dndMode = DND_MODE.SWARAJ, delay = 0 }: ProviderConfig = {}): IDnDProvider<Data, Rubbish> {

  if (delay < 0 || isNaN(delay)) delay = 0

  return {
    dndMode,
    delay,
    dropInstance: null,
    dragCoord:    {
      x: 0,
      y: 0
    },
    dragType:           null!,
    dragDom:            null!,
    dragData:           null!,
    enterDom:           null!,
    dragItemDragStarts: new Set(),
    dragItemDragEnds:   new Set(),
    dropItemDragStarts: new Set(),
    dropItemDragEnds:   new Set(),
    rubbish:            {} as any
  }
}

export function createDragMonitor<Data, Rubbish>(instance: DragCore<Data, Rubbish>): IDragCoreMonitor<Data, Rubbish> {
  return {
    event:      null!,
    getContext: () => instance.context
  }
}