import type { RubbishData, DragData } from '../utils'
import { defineComponent, onMounted } from 'vue'
import { useDnd, useDrop } from 'easy-dnd/vue'
import { formFactory } from '../component'
import { useFormDesignContext, DIRECTION, ACCEPT_TYPE, DesignNodeProps, DRAG_CLASS, NODE_TYPE } from '../utils'

/** 表单 */
export const Form = defineComponent({
  props: {
    node: DesignNodeProps['node']
  },
  setup(props) {

    const { onDrop, createSelect } = useFormDesignContext()
    const dndCtx = useDnd<RubbishData>()
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

    onMounted(() => {
      dndCtx.getRubbish().formRootDom = drop.dropDom
    })

    return () => {

      return (
        <div class='design-node' ref={drop.dropRef} onClick={onSelect} style={{ minHeight: 'calc(100% - 20px)', boxSizing: 'border-box' }}>
          <h2>表单容器</h2>
          {props.node.children?.map((t, i) => formFactory(t, '', i))}
          <SelectNode />
        </div>
      )
    }
  }
})

const SelectNode = defineComponent({
  props: {},
  setup() {

    const dndCtx = useDnd<RubbishData>(),
      formDesignCtx = useFormDesignContext()
    // cursorDomRef = shallowRef<HTMLDivElement>(null!)

    formDesignCtx.refreshSelectFrame = function (selectNode) {

      if (!selectNode) {
        formDesignCtx.selected.value = null
        return
      }

      const rubbish = dndCtx.getRubbish(),
        // 点击的元素是否是表单
        clickIsForm = selectNode.type === NODE_TYPE.FORM

      // 点击的元素
      const formRootDom = rubbish.formRootDom,
        clickDom = clickIsForm ? formRootDom : formRootDom.querySelector(`[data-id=${selectNode.id}]`)!

      // 获取尺寸
      const clickDomRect = clickDom.getBoundingClientRect(),
        formRootRect = clickIsForm ? clickDomRect : formRootDom.getBoundingClientRect(),
        borderWidth = 2

      formDesignCtx.selected.value = {
        node: selectNode,
        clickIsForm,
        styleProperty: {
          top: `${clickDomRect.top - formRootRect.top - borderWidth}px`,
          left: `${clickDomRect.left - formRootRect.left - borderWidth}px`,
          width: `${clickDomRect.width - borderWidth / 2}px`,
          height: `${clickDomRect.height - borderWidth / 2}px`,
          border: `${borderWidth}px solid #63B931`
        }
      }

    }

    function onDelete(e: MouseEvent) {
      e.stopPropagation()
      const id = formDesignCtx.selected.value!.node.id
      // 找到索引
      const position = dndCtx.getRubbish().formRootDom.querySelector(`[data-id=${id}]`)!.getAttribute('data-position')
      formDesignCtx.deleteNode({ value: position as string })
    }

    return () => {
      const selectInfo = formDesignCtx.selected.value
      if (!selectInfo) return null
      return (
        <div class={DRAG_CLASS.SELECT_NODE_BOX} style={selectInfo.styleProperty}>
          <div>
            <div>{selectInfo.node.name}</div>
            {selectInfo.clickIsForm || <button onClick={onDelete}>删除</button>}
          </div>
        </div>
      )
    }
  }
})