import {
  inject,
  provide,
  onMounted,
  onBeforeUnmount,
  defineComponent
} from 'vue'
import {
  type IDnDProvider,
  type IListenDragHooksParams,
  type IDragCoreConstructorParams,
  type IDropCoreConstructorParams,
  type IDragHooksParams,
  type IDropHooksParams,
  DND_CTX,
  DND_MODE,
  DragCore,
  DropCore,
  onListenDrag,
  createProvider
} from 'easy-dnd'

/** dnd上下文 */
const DndProvider = defineComponent({
  name:  'DndProvider',
  props: {
    type: {
      default: DND_MODE.SWARAJ
    },
    delay: {
      type:    Number,
      default: 0
    }
  },
  setup(props, { slots }) {
    provide(DND_CTX, createProvider(props))
    return () => slots.default ? slots.default() : null
  }
})

class Drag<Data = any, Rubbish = any> extends DragCore<Data, Rubbish> {

  dragRef = (dom: any) => {
    this.registerDom(dom!)
    return dom
  }

}

class Drop<Data = any, Rubbish = any> extends DropCore<Data, Rubbish> {

  public dropRef = (forwardRef: any | null | Drag<any, any>['dragRef']) => {
    if (typeof forwardRef === 'function') {
      return (dom: any) => {
        this.registerDom((forwardRef as Drag<any, any>['dragRef'])(dom)!)
      }
    }
    this.registerDom(forwardRef!)
  }

}

function useDrag<Data = {}, Rubbish = {}>(params: IDragHooksParams<Data, Rubbish>) {

  params.config['context'] = inject<IDnDProvider<Data, Rubbish>>(DND_CTX)

  const drag = new Drag(
    params as IDragCoreConstructorParams<Data, Rubbish>
  )

  onMounted(() => {
    drag.subscribe()
  })

  onBeforeUnmount(() => {
    drag.unSubscribe()
  })

  return drag

}

function useDrop<Data, Rubbish>(params: IDropHooksParams<Data, Rubbish>) {

  params.config['context'] = inject<IDnDProvider<Data, Rubbish>>(DND_CTX)

  const drop = new Drop(
    params as IDropCoreConstructorParams<Data, Rubbish>
  )

  onMounted(() => {
    drop.subscribe()
  })

  onBeforeUnmount(() => {
    drop.unSubscribe()
  })

  return drop

}

function useDragListen<Data, Rubbish>(params: IListenDragHooksParams<Data, Rubbish>) {
  // @ts-ignore 被我手动筛选掉，实际上有context
  params.context = inject<IDnDProvider<Data, Rubbish>>(DND_CTX)
  // @ts-ignore 一定有context
  const instance = onListenDrag(params)
  onBeforeUnmount(instance.unbind)
}

export * from 'easy-dnd'

export {
  Drag,
  Drop,
  useDrag,
  useDrop,
  DndProvider,
  useDragListen
}