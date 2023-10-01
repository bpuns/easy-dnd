import { inject, onMounted, onBeforeUnmount, defineComponent, provide, withDefaults, defineProps } from 'vue'
import {
  type IDnDProvider,
  type IDragCoreConstructorParams,
  type IDropCoreConstructorParams,
  DND_CTX,
  DND_MODE,
  Drag as DragCore,
  Drop as DropCore,
  createProvider
} from 'easy-dnd'

/** dnd上下文 */
export const DndProvider = defineComponent({
  name: 'DndProvider',
  props: {
    type: {
      default: DND_MODE.SWARAJ
    },
    delay: {
      type: Number,
      default: 0
    }
  },
  setup(props, { slots }) {
    provide(DND_CTX, createProvider(props.type, props.delay))
    return () => slots.default ? slots.default() : null
  }
})

/** 把context取出来，hooks中不需要加入context */
type IDragHooksParams<Data, Rubbish> = Omit<IDragCoreConstructorParams<Data, Rubbish>, 'config'> & {
  config: Omit<IDragCoreConstructorParams<Data, Rubbish>['config'], 'context'>
}

type IDropHooksParams<Data, Rubbish> = Omit<IDropCoreConstructorParams<Data, Rubbish>, 'config'> & {
  config: Omit<IDropCoreConstructorParams<Data, Rubbish>['config'], 'context'>
}


class Drag<Data = any, Rubbish = any> extends DragCore<Data, Rubbish> {

  dragRef = (dom: any) => {
    this.dragDom = dom!
    return dom
  }

}

class Drop<Data = any, Rubbish = any> extends DropCore<Data, Rubbish> {

  public dropRef = (forwardRef: any | null | Drag<any, any>['dragRef']) => {
    if (typeof forwardRef === 'function') {
      return (dom: HTMLElement | null) => {
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

export {
  useDrag,
  useDrop
}