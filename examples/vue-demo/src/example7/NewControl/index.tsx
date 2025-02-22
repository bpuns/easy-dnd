import { useDrag } from 'easy-dnd/vue'
import { defineComponent, PropType, shallowRef } from 'vue'
import { NODE_TYPE, DragData, RubbishData, DRAG_CLASS, DragNode } from '../utils'

/** 新增 */
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
          hover:    'hover',
          dragging: DRAG_CLASS.DRAGGING
        },
        data() {
          const id = Math.random().toString(32).slice(2)
          const dragNode: DragNode = {
            id,
            name:           name.value || `自动生成的${id}`,
            componentProps: {},
            type:           props.type
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