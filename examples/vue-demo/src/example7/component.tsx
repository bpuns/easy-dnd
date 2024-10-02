import { computed, defineComponent, h, inject, PropType, shallowRef } from 'vue'
import { useDrag, useDrop } from 'easy-dnd/vue'
import { DIRECTION, DRAG_CONTEXT_KEY, DragData, DragNode, NODE_TYPE, RubbishData } from './utils'

const DesignNodeProps = {
  node: {
    type:     Object as PropType<DragNode>,
    required: true as const
  },
  fatherPosition: {
    type:     String,
    required: true as const
  },
  index: {
    type:     Number,
    required: true as const
  }
}

const DRAG_CLASS = {
  DRAGGING: 'dragging',
  TOP:      'enter-top',
  BOTTOM:   'enter-bottom',
  CENTER:   'enter-center'
}

const ACCEPT_TYPE = new Set([ NODE_TYPE.GRID, NODE_TYPE.FORM_CONTROL ])

function formFactory(node: DragNode, fatherPosition: string, index: number): any {
  let control = node.type === NODE_TYPE.GRID ? Grid : FormControl
  return h(control, { key: node.id, node, fatherPosition, index })
}

function getPosition(props: { index: number, fatherPosition: string }) {
  return computed(() => {
    const { fatherPosition, index } = props
    return `${fatherPosition ? fatherPosition + '.' : ''}${index}`
  })
}

/** 表单 */
export const Form = defineComponent({
  props: {
    node: DesignNodeProps['node']
  },
  setup(props) {

    const { onDrop, createSelect } = inject(DRAG_CONTEXT_KEY)!

    const drop = useDrop<DragData, RubbishData>({
      config: {
        className: {
          dragEnter: DRAG_CLASS.CENTER
        },
        acceptType: ACCEPT_TYPE
      },
      dragEnter(monitor) {
        monitor.getRubbish().direction = DIRECTION.CENTER
      },
      drop(monitor) {
        onDrop('', monitor)
      }
    })

    const onSelect = createSelect({ value: '' })

    return () => {
      return (
        <div className='design-node' ref={drop.dropRef} onClick={onSelect}>
          <h2>表单容器</h2>
          {props.node.children?.map((t, i) => formFactory(t, '', i))}
        </div>
      )
    }
  }
})

/** 网格 */
export const Grid = defineComponent({
  props: DesignNodeProps,
  setup(props) {

    const { addClass, resetClass, onDrop, createRemoveNode, createSelect } = inject(DRAG_CONTEXT_KEY)!
    const currentPosition = getPosition(props)

    const drag = useDrag<DragData, RubbishData>({
      config: {
        type:      NODE_TYPE.GRID,
        className: {
          dragging: DRAG_CLASS.DRAGGING
        },
        data() {
          return {
            dragNode:     props.node,
            dragPosition: currentPosition.value
          }
        }
      }
    })

    const drop = useDrop<DragData, RubbishData>({
      config: {
        acceptType: ACCEPT_TYPE
      },
      dragOver(monitor) {
        const dropDom = drop.dropDom
        const rect = monitor.getDomRect()
        if (monitor.isOverTop(rect, true)) {
          addClass(dropDom, DRAG_CLASS.TOP)
          monitor.getRubbish().direction = DIRECTION.TOP
        } else if (monitor.isOverBottom(rect, true)) {
          addClass(dropDom, DRAG_CLASS.BOTTOM)
          monitor.getRubbish().direction = DIRECTION.BOTTOM
        } else {
          addClass(dropDom, DRAG_CLASS.CENTER)
          monitor.getRubbish().direction = DIRECTION.CENTER
        }
      },
      dragLeave() {
        resetClass(drop.dropDom)
      },
      dragEnd() {
        resetClass(drop.dropDom)
      },
      drop(monitor) {
        onDrop(currentPosition.value, monitor)
      }
    })

    const dropDragRef = drop.dropRef(drag.dragRef)

    const onDelete = createRemoveNode(currentPosition)
    const onSelect = createSelect(currentPosition)

    return () => {
      return (
        <div className='design-node' ref={dropDragRef} onClick={onSelect}>
          <span>{props.node.name}</span>
          <button onClick={onDelete}>移除</button>
          {props.node.children?.map((t, i) => formFactory(t, currentPosition.value, i))}
        </div>
      )
    }
  }
})

/** 表单控件 */
export const FormControl = defineComponent({
  props: DesignNodeProps,
  setup(props) {

    const { addClass, resetClass, onDrop, createRemoveNode, createSelect } = inject(DRAG_CONTEXT_KEY)!
    const currentPosition = getPosition(props)

    const drag = useDrag<DragData, RubbishData>({
      config: {
        type:      NODE_TYPE.FORM_CONTROL,
        className: {
          dragging: DRAG_CLASS.DRAGGING
        },
        data() {
          return {
            dragNode:     props.node,
            dragPosition: currentPosition.value
          }
        }
      }
    })

    const drop = useDrop<DragData, RubbishData>({
      config: {
        acceptType: ACCEPT_TYPE
      },
      dragOver(monitor) {
        const dropDom = drop.dropDom
        if (monitor.isOverTop()) {
          addClass(dropDom, DRAG_CLASS.TOP)
          monitor.getRubbish().direction = DIRECTION.TOP
        } else {
          addClass(dropDom, DRAG_CLASS.BOTTOM)
          monitor.getRubbish().direction = DIRECTION.BOTTOM
        }
      },
      dragLeave() {
        resetClass(drop.dropDom)
      },
      dragEnd() {
        resetClass(drop.dropDom)
      },
      drop(monitor) {
        onDrop(currentPosition.value, monitor)
      }
    })

    const dropDragRef = drop.dropRef(drag.dragRef)
    const onDelete = createRemoveNode(currentPosition)
    const onSelect = createSelect(currentPosition)

    return () => (
      <div className='design-node' ref={dropDragRef} onClick={onSelect}>
        <span>{props.node.name}</span>
        <button onClick={onDelete}>移除</button>
      </div>
    )
  }
})

export const NewControl = defineComponent({
  props: {
    type: {
      type:     Number as PropType<NODE_TYPE>,
      required: true
    }
  },
  setup(props) {

    const name = shallowRef('')

    const drag = useDrag<DragData, RubbishData>({
      config: {
        type:      props.type,
        className: {
          dragging: DRAG_CLASS.DRAGGING
        },
        data() {
          const id = Math.random().toString(32).slice(2)
          const dragNode: DragNode = {
            id,
            name: name.value || `自动生成的${id}`,
            type: props.type
          }
          props.type === NODE_TYPE.GRID && (dragNode.children = [])
          return {
            isAdd:        true,
            dragNode,
            dragPosition: undefined!
          }
        }
      }
    })

    return () => (
      <div ref={drag.dragRef}>
        <input type='text' placeholder='请输入名称' value={name.value} onChange={(e) => name.value = e.target.value} />
        {props.type === NODE_TYPE.GRID ? '网格' : '表单控件'}
      </div>
    )
  }
})