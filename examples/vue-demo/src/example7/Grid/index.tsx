import type { RubbishData, DragData } from '../utils'
import { useDrag, useDrop } from 'easy-dnd/vue'
import { defineComponent } from 'vue'
import { formFactory } from '../component'
import { DesignNodeProps, useFormDesignContext, getPosition, NODE_TYPE, DRAG_CLASS, ACCEPT_TYPE, DIRECTION } from '../utils'

/** 网格 */
export const Grid = defineComponent({
  props: DesignNodeProps,
  setup(props) {

    const { addClass, resetClass, onDrop, createSelect } = useFormDesignContext()
    const currentPosition = getPosition(props)

    const drag = useDrag<DragData, RubbishData>({
      config: {
        type: NODE_TYPE.GRID,
        // 只想按住某个图标才能拖动，需要设置这个属性，用于告诉easy-dnd
        // 拖拽开始之后，用哪个dom阻止拖拽的默认行为
        // 如果不设置的话，默认取 drag.dragDom
        getScopeDom(dragInstance) {
          return dragInstance.dragDom.parentElement!
        },
        className: {
          dragging: DRAG_CLASS.DRAGGING,
          hover: DRAG_CLASS.HOVER
        },
        data() {
          return {
            dragNode: props.node,
            dragPosition: currentPosition.value
          }
        }
      },
      hover() {
        // console.log('鼠标进入了')
      },
      leave() {
        // console.log('鼠标移开了')
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

    const onSelect = createSelect(currentPosition)

    return () => {
      return (
        <div
          class='design-node'
          ref={drop.dropRef}
          onClick={onSelect}
          data-position={currentPosition.value}
          data-id={props.node.id}
        >
          {/* 设置按住图标才能拖拽，需要配合 getScopeDom 使用，不然会有一些不可预料的bug出现 */}
          <img src='/drag.svg' alt='drag' ref={drag.dragRef} style={{ width: '20px', height: '20px' }} />
          <span>{props.node.name}</span>
          {props.node.children?.map((t, i) => formFactory(t, currentPosition.value, i))}
        </div>
      )
    }
  }
})
