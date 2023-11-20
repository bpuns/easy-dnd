import type { IDnDProvider, IDragCoreConstructorParams, DragDropBase } from './@types'
import { BIND_DRAG, isElement, createDragMonitor } from './utils'
import { DESTROY_TIP, SUBSCRIBE_TIP } from './utils/tips'

type DragClassName = IDragCoreConstructorParams<any, any>['config']['className']

export class DragCore<Data = any, Rubbish = any> implements DragDropBase {

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
  /** 验证是否结束，如果调用了unSubscribe，其中isEnd还是false，需要手动调用一次_dragEnd */
  _isEnd = true
  /** 是否移入 */
  _isHover = false
  /** 标识是否允许拖拽 */
  _draggable = true
  /** 记录上一次drag的clientX与clientY的位置，避免重复执行drag */
  prePosition = { x: null!, y: null! }
  /** 判断是否注册过 */
  _isSubscribe = false
  /** 样式 */
  _className!: DragClassName

  constructor(params: IDragCoreConstructorParams<Data, Rubbish>) {
    this.params = params
    this.config = params.config
    const { className, context, defaultDraggable } = params.config
    this.context = context
    this._className = className || {}
    this._draggable = defaultDraggable ?? true
  }

  /** 标识是否允许拖拽 */
  get draggable() {
    return this._draggable
  }

  /** 标识是否允许拖拽 */
  set draggable(draggable: boolean) {
    if (draggable !== this._draggable) {
      this._toggleDraggable(
        this._draggable = draggable
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
  _toggleDraggable = (draggable: boolean) => {
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
      this._draggable = draggable
    }
  }

  /** 修改样式 */
  _editClass = (operate: 'add' | 'remove', key: keyof DragClassName) => {
    const classValue = this._className[key]
    classValue && this.dragDom?.classList[operate](classValue)
  }

  subscribe = () => {
    if (this._isSubscribe) return
    const { dragDom, context: ctx } = this
    if (!ctx.drags) throw new Error(DESTROY_TIP)
    if (!isElement(dragDom)) {
      throw new Error(SUBSCRIBE_TIP('Drag'))
    }
    ctx.drags.add(this)
    this._toggleDraggable(this._draggable = this._isSubscribe = true)
    ctx.dragItemDragStarts.add(this._dragItemDragStart)
    ctx.dragItemDragEnds.add(this._dragItemDragEnd)
    this._addHover()
    this._className.hover && dragDom.addEventListener('mouseleave', this._mouseleave)
    dragDom.addEventListener('dragstart', this._dragStart)
    dragDom.addEventListener('drag', this._drag)
    dragDom.addEventListener('dragend', this._dragEnd)
    return this
  }

  unSubscribe = () => {
    if (!this._isSubscribe) return
    const { dragDom, context:ctx } = this
    if (dragDom) {
      this._toggleDraggable(dragDom[BIND_DRAG] = this._draggable = this._isSubscribe = false)
      // 如果结束拖拽标识不为true，需要手动调用_dragEnd还原状态
      !this._isEnd && this._dragEnd(this.monitor.event)
      this._removeHover()
      this._className.hover && dragDom.removeEventListener('mouseleave', this._mouseleave)
      dragDom.removeEventListener('dragstart', this._dragStart)
      dragDom.removeEventListener('drag', this._drag)
      dragDom.removeEventListener('dragend', this._dragEnd)
      this.dragDom = null!
    }
    ctx.drags.delete(this)
    ctx.dragItemDragEnds.delete(this._dragItemDragEnd)
    ctx.dragItemDragStarts.delete(this._dragItemDragStart)
  }

  _mouseenter = () => {
    if (!this.context.dragDom && this._draggable) {
      this._isHover = true
      this._editClass('add', 'hover')
    }
  }

  _mouseleave = () => {
    if (this._isHover && this._draggable) {
      this._isHover = false
      this._editClass('remove', 'hover')
    }
  }

  _dragStart = (e: DragEvent) => {
    const { monitor, context: ctx, params, config } = this
    // dragStart必须阻止冒泡，不然在多层嵌套下会出现问题
    e.stopPropagation()
    monitor.event = e
    // 存储状态到全局
    ctx.dragType = config.type
    ctx.dragDom = this.dragDom
    ctx.dropInstance = null
    ctx.dragData = config.data?.()
    // 存储拖拽实例
    ctx.dragInstance = this
    // unSubscribe的时候要用
    this._isEnd = false
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
    for (itemDragStart of ctx.dragItemDragStarts) itemDragStart()
    // 调用所有dropItemDragStart函数
    for (itemDragStart of ctx.dropItemDragStarts) itemDragStart()
    itemDragStart = null!
    // 添加样式
    this._editClass('add', 'dragging')
  }

  _drag = (e: DragEvent) => {
    if (this.params.drag) {
      this.monitor.event = e
      const { dragCoord } = this.context
      const prePosition = this.prePosition
      // 避免重复执行dragOver
      if (
        prePosition.x !== dragCoord.x ||
        prePosition.y !== dragCoord.y
      ) {
        prePosition.x = dragCoord.x
        prePosition.y = dragCoord.y
        this.params.drag?.(this.monitor)
      }
    }
  }

  _dragEnd = (e: DragEvent) => {
    const { monitor, params, context: ctx } = this
    // 把状态还原，不然组件卸载的时候，会多触发一次dragEnd方法
    this._isEnd = true
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
    for (itemDragEnd of ctx.dragItemDragEnds) itemDragEnd()
    // 执行所有dndCtx的dropItems中的函数
    for (itemDragEnd of ctx.dropItemDragEnds) itemDragEnd()
    this._clearMemory()
    // 移除样式
    this._editClass('remove', 'dragging')
    // 清除拖拽实例
    setTimeout(() => ctx.dragInstance = null)
  }

  /** 清空内存占用，避免内存泄露 */
  _clearMemory = () => {
    const ctx = this.context
    ctx.dragDom = null!
    ctx.dragData = null!
    ctx.enterDom = null!
    this.monitor.event = null!
  }

  _addHover = () => {
    if (this._className.hover && this.dragDom) {
      this.dragDom.addEventListener('mouseenter', this._mouseenter)
    }
  }

  _removeHover = () => {
    if (this._className.hover && this.dragDom) {
      this.dragDom.removeEventListener('mouseenter', this._mouseenter)
    }
  }

  _dragItemDragStart = () => {
    this._mouseleave()
    // 拖拽开始需要移除hover监听，不然结束拖拽，原来拖拽位置会再触发一次mouseEnter（浏览器问题，无法解决）
    this._removeHover()
  }

  _dragItemDragEnd = () => {
    // 拖拽结束在绑定一次hover事件
    setTimeout(() => this._addHover())
  }

}