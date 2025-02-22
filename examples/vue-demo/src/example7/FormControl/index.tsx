import { useDrag, useDrop } from 'easy-dnd/vue'
import { defineComponent } from 'vue'
import { DesignNodeProps, useFormDesignContext, getPosition, DragData, RubbishData, NODE_TYPE, DRAG_CLASS, ACCEPT_TYPE, DIRECTION } from '../utils'

/** 表单控件 */
export const FormControl = defineComponent({
  props: DesignNodeProps,
  setup(props) {

    const { addClass, resetClass, onDrop, createSelect } = useFormDesignContext()
    const currentPosition = getPosition(props)

    const drag = useDrag<DragData, RubbishData>({
      config: {
        type:      NODE_TYPE.FORM_CONTROL,
        className: {
          // hover:    'hover',
          dragging: DRAG_CLASS.DRAGGING
        },
        data() {
          return {
            dragNode:     props.node,
            dragPosition: currentPosition.value
          }
        }
      }
      // hover() {
      //   console.log('hover', props.node)
      // }
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
    const onSelect = createSelect(currentPosition)

    return () => (
      <div
        className='design-node'
        ref={dropDragRef}
        onClick={onSelect}
        data-position={currentPosition.value}
        data-id={props.node.id}
      >
        <span>{props.node.name}</span>
      </div>
    )
  }
})