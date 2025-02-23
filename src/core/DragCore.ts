import type { IDragCoreConstructorParams } from './@types'
import { DragDropBase } from './@types'
import { isElement, createDragMonitor, assign, EMPTY_OBJECT } from './utils'
import { DESTROY_TIP, SUBSCRIBE_TIP, DROP_FLAG } from './utils/private'

type DragClassName = IDragCoreConstructorParams<any, any>['config']['className']

/** 存在hover方法 */
const HOVER_STATE = {
  CLASS: 0b001,
  LEAVE: 0b010,
  FUNC:  0b100,
  NONE:  0b000,
  ALL:   0b111
}

export class DragCore<Data = any, Rubbish = any> extends DragDropBase<Data, Rubbish> {

  /** 用于绑定drag的dom函数 */
  dragDom!: HTMLElement
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
  /** 判断是否注册过 */
  _isSubscribe = false
  /** 样式 */
  _className!: DragClassName
  /** 标识hover的状态 */
  _hoverState!: number

  constructor(params: IDragCoreConstructorParams<Data, Rubbish>) {
    super()
    const { className, context, defaultDraggable } = params.config
    this._draggable = defaultDraggable ?? true
    const _className = className || EMPTY_OBJECT
    assign(this, {
      params,
      config:      params.config,
      context:     context,
      _className,
      _hoverState: (() => {
        let initState = HOVER_STATE.NONE
        _className['hover'] && (initState = initState | HOVER_STATE.CLASS)
        params.hover && (initState = initState | HOVER_STATE.FUNC)
        params.leave && (initState = initState | HOVER_STATE.LEAVE)
        return initState
      })()
    })
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
    if (classValue) {
      const dom = this.context.dragPreventDom || this.dragDom
      dom.classList[operate](classValue)
    }
  }

  /** 是否存在hover */
  _hasHover() {
    return (this._hoverState & HOVER_STATE.ALL) > 0
  }

  subscribe = () => {
    if (this._isSubscribe) return
    const { dragDom, context: ctx } = this
    if (!ctx._drags) throw new Error(DESTROY_TIP)
    if (!isElement(dragDom)) {
      throw new Error(SUBSCRIBE_TIP('Drag'))
    }
    ctx._drags.add(this)
    this._toggleDraggable(this._draggable)
    this._isSubscribe = true
    ctx._dragItemDragStarts.add(this._dragItemDragStart)
    ctx._dragItemDragEnds.add(this._dragItemDragEnd)
    this._addHover()
    this._hasHover() && dragDom.addEventListener('mouseleave', this._mouseleave)
    dragDom.addEventListener('dragstart', this._dragStart)
    dragDom.addEventListener('drag', this._drag)
    dragDom.addEventListener('dragend', this._dragEnd)
    return this
  }

  unSubscribe = () => {
    if (!this._isSubscribe) return
    const { dragDom, context: ctx } = this
    if (dragDom) {
      this._toggleDraggable(this._draggable = this._isSubscribe = false)
      // 如果结束拖拽标识不为true，需要手动调用_dragEnd还原状态
      !this._isEnd && this._dragEnd(this.monitor.event)
      this._removeHover()
      this._hasHover() && dragDom.removeEventListener('mouseleave', this._mouseleave)
      dragDom.removeEventListener('dragstart', this._dragStart)
      dragDom.removeEventListener('drag', this._drag)
      dragDom.removeEventListener('dragend', this._dragEnd)
      this.dragDom = null!
    }
    ctx._drags.delete(this)
    ctx._dragItemDragEnds.delete(this._dragItemDragEnd)
    ctx._dragItemDragStarts.delete(this._dragItemDragStart)
  }

  _mouseenter = (e: MouseEvent) => {
    if (!this.context.dragDom && this._draggable) {
      this._isHover = true
      if (this._hoverState & HOVER_STATE.CLASS) this._editClass('add', 'hover')
      if (this._hoverState & HOVER_STATE.FUNC) {
        this.monitor.event = e
        this.params.hover!(this.monitor, this.context)
      }
    }
  }

  _mouseleave = (e?: MouseEvent) => {
    if (this._isHover && this._draggable) {
      this._isHover = false
      if (this._hoverState & HOVER_STATE.CLASS) this._editClass('remove', 'hover')
      if (this._hoverState & HOVER_STATE.LEAVE) {
        e && (this.monitor.event = e)
        this.params.leave!(this.monitor, this.context)
      }
    }
  }

  _dragStart = (e: Event) => {
    const { monitor, context: ctx, params, config } = this
    // dragStart必须阻止冒泡，不然在多层嵌套下会出现问题
    e.stopPropagation()
    monitor.event = e
    // 存储状态到全局
    ctx.dragType = config.type
    ctx.dragDom = monitor.dragDom = this.dragDom
    ctx.dragPreventDom = config.getPreventDom?.(monitor, ctx) || this.dragDom
    ctx.dropInstance = null
    // 存储拖拽数据
    ctx.dragData = config.data?.()
    // 存储拖拽实例
    ctx.dragInstance = this
    // @ts-ignore 一定会有clientX
    ctx.dragCoord.x = e.clientX
    // @ts-ignore 一定会有clientX
    ctx.dragCoord.y = e.clientY
    // unSubscribe的时候要用
    this._isEnd = false
    // 如果当前drag元素等于drop元素，把子节点下所有元素改为 pointer-events: none 
    ctx.dragPreventDom.querySelectorAll(`[${DROP_FLAG}]`).forEach(t => {
      t['style']['pointerEvents'] = 'none'
    })
    // 拖拽监听函数
    const { _dragListen } = ctx
    _dragListen._ing = _dragListen._queue.filter(t => t.filter(ctx))
    this._execListen('dragStart', ctx)
    // 调用状态变化回调
    params?.dragStart?.(monitor, ctx)
    let itemDragStart: () => void
    // 调用所有dragItemDragStart函数
    for (itemDragStart of ctx._dragItemDragStarts) itemDragStart()
    // 调用所有dropItemDragStart函数
    for (itemDragStart of ctx._dropItemDragStarts) itemDragStart()
    // 添加样式
    this._editClass('add', 'dragging')
  }

  _drag = (e: Event) => {
    this.monitor.event = e
    e.stopPropagation()
    const { context: ctx, prePosition } = this
    const { dragCoord } = ctx
    // 避免重复执行drag
    if (
      prePosition.x !== dragCoord.x ||
      prePosition.y !== dragCoord.y
    ) {
      prePosition.x = dragCoord.x
      prePosition.y = dragCoord.y
      this._execListen('drag', ctx)
      this.params?.drag?.(this.monitor, ctx)
    }
  }

  _dragEnd = (e: Event) => {
    const { monitor, params, context: ctx } = this
    // 把状态还原，不然组件卸载的时候，会多触发一次dragEnd方法
    this._isEnd = true
    e.stopPropagation()
    monitor.event = e
    // 还原pointer-events
    ctx.dragPreventDom.querySelectorAll(`[${DROP_FLAG}]`).forEach(t => {
      (t as HTMLElement).style.removeProperty('pointer-events')
    })
    this._execListen('dragEnd', ctx)
    // 调用状态变化回调
    params?.dragEnd?.(monitor, ctx)
    let itemDragEnd: () => void
    // 执行所有dndCtx的dragItems中的函数
    for (itemDragEnd of ctx._dragItemDragEnds) itemDragEnd()
    // 执行所有dndCtx的dropItems中的函数
    for (itemDragEnd of ctx._dropItemDragEnds) itemDragEnd()
    // 移除样式
    this._editClass('remove', 'dragging')
    // 清除拖拽实例
    setTimeout(() => ctx.dragInstance = null)
    // 清除监听过程函数
    ctx._dragListen._ing = null!
    this._clearMemory()
  }

  /** 清空内存占用，避免内存泄露 */
  _clearMemory = () => {
    const ctx = this.context
    ctx.dragDom
      = ctx.dragData
      = ctx.enterDom
      = ctx.dragPreventDom
      = this.monitor.event
      = null!
  }

  _addHover = () => {
    if (this._hasHover() && this.dragDom) {
      this.dragDom.addEventListener('mouseenter', this._mouseenter)
    }
  }

  _removeHover = () => {
    if (this._hasHover() && this.dragDom) {
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