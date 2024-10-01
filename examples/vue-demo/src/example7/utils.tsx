import type { IDropCoreMonitor } from 'easy-dnd'
import { enablePatches, produceWithPatches, setAutoFreeze, applyPatches, produce } from 'immer'
import { ref, provide, type InjectionKey, Ref } from 'vue'

enablePatches()
setAutoFreeze(false)

export const DRAG_CONTEXT_KEY = Symbol('dragContext') as InjectionKey<ReturnType<typeof useFormDragContext>>

/** 放置方向 */
export const enum DIRECTION {
  UP = 0,
  DOWN = 1,
  CENTER = 2
}

/** 节点类型 */
export const enum NODE_TYPE {
  FORM = 0,
  GRID = 1,
  FORM_CONTROL = 2
}

/** 节点数据 */
export interface DragNode {
  id: string
  name: string,
  type: NODE_TYPE,
  children?: DragNode[]
}

/** 拖拽数据 */
export interface DragData {
  /** 拖拽的节点 */
  dragNode: DragNode,
  /** 拖拽位置 */
  dragPosition: string
}

/** 拖拽生命周期内存储的临时数据 */
export interface RubbishData {
  /** 放置元素的信息 */
  direction: DIRECTION
}

// type Monitor = IDropCoreMonitor<DragNode, RubbishData>

export function useFormDragContext() {
  const designData = ref<DragNode>({
    id:       'root',
    name:     '表单',
    type:     NODE_TYPE.FORM,
    children: [
      {
        id:       'a',
        type:     NODE_TYPE.GRID,
        name:     '网格布局1',
        children: [
          { id: 'a1', name: '输入框', type: NODE_TYPE.FORM_CONTROL },
          { id: 'a2', name: '多行文本', type: NODE_TYPE.FORM_CONTROL }
        ]
      },
      { id: 'b', name: '下拉框', type: NODE_TYPE.FORM_CONTROL },
      {
        id:       'c',
        name:     '网格布局2',
        type:     NODE_TYPE.GRID,
        children: [
          { id: 'c1', name: '内部对象', type: NODE_TYPE.FORM_CONTROL },
          { id: 'c2', name: '富文本', type: NODE_TYPE.FORM_CONTROL }
        ]
      }
    ]
  })

  function parsePathNode(node: DragNode, path: string) {
    const paths = path.split('.')
    const nodeLinks: DragNode[] = [ node ]
    const indexLinks: number[] = []
    for (const path of paths) {
      const index = Number(path)
      indexLinks.push(index)
      node = node.children![index]
      nodeLinks.push(node)
    }
    return {
      nodeLinks,
      indexLinks,
      lastNode:       node,
      lastIndex:      indexLinks.at(-1)!,
      lastNodeParent: nodeLinks.at(-2)!
    }
  }

  const provideData = {
    /** 设计数据 */
    designData,
    /** 重置样式 */
    resetClass(dom: HTMLElement) {
      dom.className = 'design-node'
    },
    /** 添加样式 */
    addClass(dom: HTMLElement, className: string) {
      provideData.resetClass(dom)
      dom.classList.add(className)
    },
    /** 节点移除 */
    createRemoveNode(position: Ref<string>) {
      return () => {
        const [ nextState, patches, inversePatches ] = produceWithPatches(
          designData.value,
          draft => {
            const { lastNodeParent, lastIndex } = parsePathNode(draft, position.value)
            lastNodeParent.children!.splice(lastIndex, 1)
          }
        )
        designData.value = nextState
      }
    }
    /** 放置事件 */
    // onDrop(monitor: Monitor) {

    // }
  }

  provide(DRAG_CONTEXT_KEY, provideData)

  return provideData

}