import { computed, defineComponent, h, inject, PropType } from 'vue'
import { useDrag, useDrop } from 'easy-dnd/vue'
import { DRAG_CONTEXT_KEY, DragData, DragNode, NODE_TYPE, RubbishData } from './utils'

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

    const drop = useDrop<DragData, RubbishData>({
      config: {
        className: {
          dragEnter: DRAG_CLASS.CENTER
        },
        acceptType: ACCEPT_TYPE
      }
    })

    return () => {
      return (
        <div className='design-node' ref={drop.dropRef}>
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

    const { addClass, resetClass, createRemoveNode } = inject(DRAG_CONTEXT_KEY)!
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
        } else if (monitor.isOverBottom(rect, true)) {
          addClass(dropDom, DRAG_CLASS.BOTTOM)
        } else {
          addClass(dropDom, DRAG_CLASS.CENTER)
        }
      },
      dragLeave() {
        resetClass(drop.dropDom)
      },
      dragEnd() {
        resetClass(drop.dropDom)
      }
    })

    const dropDragRef = drop.dropRef(drag.dragRef)
    const onDelete = createRemoveNode(currentPosition)

    return () => {
      return (
        <div className='design-node' ref={dropDragRef}>
          <span>网格布局</span>
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

    const { addClass, resetClass, createRemoveNode } = inject(DRAG_CONTEXT_KEY)!
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
        } else {
          addClass(dropDom, DRAG_CLASS.BOTTOM)
        }
      },
      dragLeave() {
        resetClass(drop.dropDom)
      },
      dragEnd() {
        resetClass(drop.dropDom)
      }
    })

    const dropDragRef = drop.dropRef(drag.dragRef)

    const onDelete = createRemoveNode(currentPosition)

    return () => (
      <div className='design-node' ref={dropDragRef}>
        <span>{props.node.name}</span>
        <button onClick={onDelete}>移除</button>
      </div>
    )
  }
})