import type { IDnDProvider, IDragCoreConstructorParams, DragDropBase } from './@types'
import { BIND_DRAG, isElement, createDragMonitor } from './utils'

type DragClassName = IDragCoreConstructorParams<any, any>['config']['className']

export class Drag<Data = any, Rubbish = any> implements DragDropBase {

  /** 用于绑定drag的dom函数 */
  dragDom!: HTMLElement
  /** 拖拽上下文 */
  context!: IDnDProvider<Data, Rubbish>
  /** params */
  params!: IDragCoreConstructorParams<Data, Rubbish>
  /** params中的配置 */
  config!: IDragCoreConstructorParams<Data, Rubbish>['config']
  /** monitor */
  monitor = createDragMonitor<Data, Rubbish>(this)
  // 解决 doc/拖拽研究.md 2.5 问题
  /** 验证是否结束，如果调用了unSubscribe，其中isEnd还是false，需要手动调用一次#dragEnd */
  #isEnd = true
  /** 是否移入 */
  #isHover = false
  /** 标识是否允许拖拽 */
  #draggable = true
  /** 判断是否注册过 */
  #isSubscribe = false
  /** 样式 */
  #className!: DragClassName

  constructor(params: IDragCoreConstructorParams<Data, Rubbish>) {
    this.params = params
    this.config = params.config
    const { className, context, defaultDraggable } = params.config
    this.context = context
    this.#className = className || {}
    this.#draggable = defaultDraggable ?? true
  }

  /** 标识是否允许拖拽 */
  get draggable() {
    return this.#draggable
  }

  /** 标识是否允许拖拽 */
  set draggable(draggable: boolean) {
    if (draggable !== this.#draggable) {
      this.#toggleDraggable(
        this.#draggable = draggable
      )
    }
  }

  /** dom注册 */
  registerDom = (dom: HTMLElement) => {
    this.dragDom = dom
    if (isElement(dom)) {
      dom[BIND_DRAG] = true
    }
    return this
  }

  /** 切换拖拽状态 */
  #toggleDraggable = (draggable: boolean) => {
    const { dragDom } = this
    if (isElement(dragDom)) {
      if (draggable) {
        dragDom.setAttribute('draggable', 'true')
        dragDom.style.cursor = 'move'
      } else {
        dragDom.removeAttribute('draggable')
        dragDom.style.removeProperty('cursor')
      }
    }
    // 如果dragDom不存在，说明可能还没调用subscribe，那么直接设置为默认值
    else {
      this.#draggable = draggable
    }
  }

  /** 修改样式 */
  #editClass = (operate: 'add' | 'remove', key: keyof DragClassName) => {
    const classValue = this.#className[key]
    classValue && this.dragDom?.classList[operate](classValue)
  }

  subscribe = () => {
    if (this.#isSubscribe) return
    const { dragDom, context } = this
    if (!isElement(dragDom)) {
      throw new Error('class Drag调用subscribe方法前必须调用registerDom方法')
    }
    this.#isSubscribe = true
    context.dragItemDragStarts.add(this.#dragItemDragStart)
    context.dragItemDragEnds.add(this.#dragItemDragEnd)
    this.#addHover()
    this.#className.hover && dragDom.addEventListener('mouseleave', this.#mouseleave)
    this.#toggleDraggable(this.#draggable)
    dragDom.addEventListener('dragstart', this.#dragStart)
    dragDom.addEventListener('drag', this.#drag)
    dragDom.addEventListener('dragend', this.#dragEnd)
    return this
  }

  unSubscribe = () => {
    if (!this.#isSubscribe) return
    const { dragDom, context } = this
    if (dragDom) {
      this.#isSubscribe = false
      // 如果结束拖拽标识不为true，需要手动调用#dragEnd还原状态
      !this.#isEnd && this.#dragEnd(this.monitor.event)
      this.#toggleDraggable(this.#draggable)
      this.#removeHover()
      this.#className.hover && dragDom.removeEventListener('mouseleave', this.#mouseleave)
      dragDom.removeEventListener('dragstart', this.#dragStart)
      dragDom.removeEventListener('drag', this.#drag)
      dragDom.removeEventListener('dragend', this.#dragEnd)
      this.dragDom = null!
    }
    context.dragItemDragEnds.delete(this.#dragItemDragEnd)
    context.dragItemDragStarts.delete(this.#dragItemDragStart)
  }

  #mouseenter = () => {
    if (!this.context.dragDom) {
      this.#isHover = true
      this.#editClass('add', 'hover')
    }
  }

  #mouseleave = () => {
    if (this.#isHover) {
      this.#isHover = false
      this.#editClass('remove', 'hover')
    }
  }

  #dragStart = (e: DragEvent) => {
    const { monitor, context, params, config } = this
    // dragStart必须阻止冒泡，不然在多层嵌套下会出现问题
    e.stopPropagation()
    monitor.event = e
    // 存储状态到全局
    context.dragType = config.type
    context.dragDom = this.dragDom
    context.dropInstance = null
    context.dragData = config.data()
    // unSubscribe的时候要用
    this.#isEnd = false
    // 如果当前drag元素等于drop元素，把子节点下所有元素改为 pointer-events: none 
    const childNodes = Array.from(this.dragDom.children) as HTMLElement[]
    let child: HTMLElement
    for (child of childNodes) {
      child['style']['pointerEvents'] = 'none'
    }
    // 调用状态变化回调
    params.dragStart && params.dragStart(monitor)
    let itemDragStart: () => void
    // 调用所有dragItemDragStart函数
    for (itemDragStart of this.context.dragItemDragStarts) itemDragStart()
    // 调用所有dropItemDragStart函数
    for (itemDragStart of this.context.dropItemDragStarts) itemDragStart()
    itemDragStart = null!
    // 添加样式
    this.#editClass('add', 'dragging')
  }

  #drag = (e: DragEvent) => {
    const { dragCoord } = this.context
    dragCoord.x = e.clientX
    dragCoord.y = e.clientY
    if (this.params.drag) {
      this.monitor.event = e
      this.params.drag(this.monitor)
    }
  }

  #dragEnd = (e: DragEvent) => {
    const { monitor, params } = this
    // 把状态还原，不然组件卸载的时候，会多触发一次dragEnd方法
    this.#isEnd = true
    monitor.event = e
    // 还原pointer-events
    const childNodes = Array.from(this.dragDom.children) as HTMLElement[]
    let child: HTMLElement
    for (child of childNodes) {
      child['style']['pointerEvents'] = 'auto'
    }
    // 调用状态变化回调
    params.dragEnd && params.dragEnd(monitor)
    let itemDragEnd: () => void
    // 执行所有dndCtx的dragItems中的函数
    for (itemDragEnd of this.context.dragItemDragEnds) itemDragEnd()
    // 执行所有dndCtx的dropItems中的函数
    for (itemDragEnd of this.context.dropItemDragEnds) itemDragEnd()
    this.#clearMemory()
    // 移除样式
    this.#editClass('remove', 'dragging')
  }

  /** 清空内存占用，避免内存泄露 */
  #clearMemory = () => {
    this.context.dragDom = null!
    this.context.dragData = null!
    this.context.enterDom = null!
    this.monitor.event = null!
  }

  #addHover = () => {
    if (this.#className.hover && this.dragDom) {
      this.dragDom.addEventListener('mouseenter', this.#mouseenter)
    }
  }

  #removeHover = () => {
    if (this.#className.hover && this.dragDom) {
      this.dragDom.removeEventListener('mouseenter', this.#mouseenter)
    }
  }

  #dragItemDragStart = () => {
    this.#mouseleave()
    // 拖拽开始需要移除hover监听，不然结束拖拽，原来拖拽位置会再触发一次mouseEnter（浏览器问题，无法解决）
    this.#removeHover()
  }

  #dragItemDragEnd = () => {
    // 拖拽结束在绑定一次hover事件
    setTimeout(() => this.#addHover())
  }

}