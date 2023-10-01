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

export * from './createDragMonitor'
export * from './createDropMonitor'
export * from './createProvider'