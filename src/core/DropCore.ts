import type { IDnDProvider, DragDropBase, IDropCoreConstructorParams } from './@types'
import { DND_MODE } from './@types'
import { BIND_DRAG, isElement, createDropMonitor } from './utils'
import { DESTROY_TIP, SUBSCRIBE_TIP } from './utils/tips'

type DropClassName = IDropCoreConstructorParams<any, any>['config']['className']

export class DropCore<Data = any, Rubbish = any> implements DragDropBase {

  /** 用于绑定drop的dom函数 */
  dropDom!: HTMLElement
  /** 拖拽上下文 */
  context!: IDnDProvider<Data, Rubbish>
  /** params */
  params!: IDropCoreConstructorParams<Data, Rubbish>
  /** params中的配置 */
  config!: IDropCoreConstructorParams<Data, Rubbish>['config']
  /** monitor */
  monitor = createDropMonitor(this)
  /** 进入了 */
  isEnter: boolean = false
  /** 进入定时器 */
  enterTimer!: number
  /** 记录上一次dragover的clientX与clientY的位置，避免重复执行dragOver */
  prePosition = { x: null!, y: null! }
  /** 解决子节点重复事件冒泡问题 */
  #stack = 0
  /** 判断是否注册过 */
  #isSubscribe = false
  /** 样式 */
  #className!: DropClassName
  /** 当允许放置元素的方法调用的时候，把canDrop结果存起来，结束拖拽的时候用的到 */
  #canDrop = false

  constructor(params: IDropCoreConstructorParams<Data, Rubbish>) {
    this.params = params
    this.config = params.config
    this.#className = this.config.className || {}
    this.context = this.config.context
  }

  registerDom = (dom: HTMLElement) => {
    this.dropDom = dom
    return this
  }

  subscribe = () => {
    if (this.#isSubscribe) return
    const { dropDom, context } = this
    if (!context.drops) throw new Error(DESTROY_TIP)
    if (!isElement(dropDom)) {
      throw new Error(SUBSCRIBE_TIP('Drop'))
    }
    context.drops.add(this)
    this.#isSubscribe = true
    context.dropItemDragStarts.add(this.#dropItemDragStart)
    context.dropItemDragEnds.add(this.#dropItemDragEnd)
    dropDom.addEventListener('dragenter', this.#dragenter)
    dropDom.addEventListener('dragover', this.#dragover)
    dropDom.addEventListener('dragleave', this.#dragleave)
    dropDom.addEventListener('drop', this.#drop)
    return this
  }

  unSubscribe = () => {
    if (!this.#isSubscribe) return
    const { dropDom } = this
    if (dropDom) {
      this.#isSubscribe = false
      // 移除绑定在context上的事件
      this.context.dropItemDragEnds.delete(this.#dropItemDragEnd)
      this.context.dropItemDragStarts.delete(this.#dropItemDragStart)
      dropDom.removeEventListener('dragenter', this.#dragenter)
      dropDom.removeEventListener('dragover', this.#dragover)
      dropDom.removeEventListener('dragleave', this.#dragleave)
      dropDom.removeEventListener('drop', this.#drop)
      this.dropDom = null!
      this.context.drops.delete(this)
    }
  }

  /** 修改样式 */
  #editClass = (operate: 'add' | 'remove', key: keyof DropClassName) => {
    const classValue = this.#className[key]
    classValue && this.dropDom?.classList[operate](classValue)
  }

  canDrop = (e?: DragEvent) => {
    const { dragDom } = this.context
    // 如果dragDom不存在，说明不是同一个上下文的拖拽，阻止拖拽
    if (!dragDom) return false
    this.monitor.event = e
    // 如果自己拖自己，不能drop
    if (this.dropDom[BIND_DRAG] && dragDom === this.dropDom) return false
    // 拖拽的类型是否在当前实例的acceptType中
    if (this.config.acceptType.has(this.monitor.getDragType())) {
      // 验证config中是否也允许拖拽
      if (this.config.canDrop) {
        if (this.config.canDrop(this.monitor['_s'])) {
          e?.preventDefault()
          return true
        } else {
          return false
        }
      }
      // 100%允许拖拽
      else {
        e?.preventDefault()
        return true
      }
    } else {
      return false
    }
  }

  stopPropagation = (e: DragEvent) => {
    if (this.context.dndMode === DND_MODE.SWARAJ) e.stopPropagation()
  }

  #dragenter = (e: DragEvent) => {
    this.stopPropagation(e)
    if (!this.canDrop(e)) return
    if (this.#stack++ === 0) {
      this.context.enterDom = this.dropDom
      // 如果delay不为0，那么放置到定时器中执行，如果等于0，直接执行
      const logic = () => {
        this.enterTimer = null!
        if (this.context.enterDom === this.dropDom) {
          this.isEnter = true
          this.params.dragEnter?.(this.monitor)
          this.#editClass('add', 'dragEnter')
        }
      }
      const delay = this.context.delay
      if (delay > 0) {
        this.enterTimer = setTimeout(logic, delay) as unknown as number
      } else {
        logic()
      }
    }
  }

  #dragover = (e: DragEvent) => {
    this.stopPropagation(e)
    if (!this.canDrop(e)) return
    if (this.isEnter) {
      const { dragCoord } = this.context
      const prePosition = this.prePosition
      // 避免重复执行dragOver
      if (
        prePosition.x !== dragCoord.x ||
        prePosition.y !== dragCoord.y
      ) {
        prePosition.x = e.clientX
        prePosition.y = e.clientY
        this.params.dragOver?.(this.monitor)
      }
    }
  }

  #dragleave = (e: DragEvent) => {
    this.stopPropagation(e)
    if (!this.canDrop(e)) return
    if (!--this.#stack) {
      // 清除定时器
      if (this.enterTimer) {
        clearTimeout(this.enterTimer)
      } else {
        if (this.isEnter) {
          this.isEnter = false
          this.#editClass('remove', 'dragEnter')
          this.params.dragLeave?.(this.monitor)
        }
      }
    }
  }

  #drop = (e: DragEvent) => {
    this.stopPropagation(e)
    if (!this.canDrop(e)) return
    this.context.dropInstance = this
    this.#editClass('remove', 'dragEnter')
    this.params.drop?.(this.monitor)
  }

  /** 元素开始拖拽的时候触发的方法 */
  #dropItemDragStart = () => {
    const { dragStart } = this.params
    this.#canDrop = this.canDrop()
    if (!this.#canDrop) return
    dragStart?.(this.monitor)
    // 添加样式
    this.#editClass('add', 'canDrop')
  }

  /** 元素停止拖拽的时候触发的方法，清空入栈检测 */
  #dropItemDragEnd = () => {
    // 执行dragEnd回调
    const { dragEnd } = this.params
    if (dragEnd && this.#canDrop) {
      dragEnd?.(this.monitor)
    }
    // 移除样式
    this.#editClass('remove', 'canDrop')
    // 重置标识
    this.#stack = 0
    this.isEnter = false
    this.monitor.event = null!
  }

}