import type { IDropCoreMonitor } from 'easy-dnd'
import { ref, provide, type InjectionKey, Ref, shallowRef } from 'vue'
import {
  type Patch,
  enablePatches,
  produceWithPatches,
  setAutoFreeze,
  applyPatches
} from 'immer'

enablePatches()
setAutoFreeze(false)

// let obj = { a: 0 }
// let list: { undo: Patch[], redo: Patch[] }[] = []
// let point = -1

// function add() {
//   const [ nextState, patches, inversePatches ] = produceWithPatches(
//     obj,
//     draft => {
//       draft.a++
//     }
//   )
//   // 删除point之后的记录
//   list.splice(point + 1)
//   // 记录当前操作
//   list.push({
//     undo: inversePatches,
//     redo: patches
//   })
//   point++
//   obj = nextState
// }

// function undo() {
//   if (point >= 0) {
//     obj = applyPatches(obj, list[point].undo)
//     point--
//   } else {
//     console.log('没有可撤销的操作')
//   }
// }

// function redo() {
//   if (point < list.length - 1) {
//     point++
//     obj = applyPatches(obj, list[point].redo)
//   } else {
//     console.log('没有可重做的操作')
//   }
// }

// console.log('当前', obj.a, obj.a === 0)
// add()
// add()
// console.log('当前', obj.a, obj.a === 2)
// undo()
// console.log('当前', obj.a, obj.a === 1)
// undo()
// console.log('当前', obj.a, obj.a === 0)
// undo()
// console.log('当前', obj.a, obj.a === 0)
// redo()
// console.log('当前', obj.a, obj.a === 1)
// redo()
// console.log('当前', obj.a, obj.a === 2)
// redo()
// console.log('当前', obj.a, obj.a === 2)

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

  const history = shallowRef({
    list:  [] as { undo: Patch[], redo: Patch[] }[],
    point: -1
  })

  /**
   * 解析路径
   * @param node 
   * @param path 
   * @returns 
   */
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

  /** 历史记录 */
  function recordHistory(record: unknown) {
    const [ nextState, patches, inversePatches ] = record as [DragNode, Patch[], Patch[]]
    const { list, point } = history.value
    list.splice(point + 1)
    list.push({ undo: inversePatches, redo: patches })
    // 如果历史栈超过 5 个，移除最旧的记录
    list.length > 5 && list.shift()
    // 更新 designData 和 history 的值
    designData.value = nextState
    // 确保 point 不超过 4
    history.value = { list, point: Math.min(point + 1, 4) }
  }

  const provideData = {
    /** 设计数据 */
    designData,
    /** 历史记录 */
    history,
    /** 撤销 */
    undo() {
      const { list, point } = history.value
      if (point >= 0) {
        designData.value = applyPatches(designData.value, list[point].undo)
        history.value = { list, point: point - 1 }
      } else {
        console.log('没有可撤销的操作')
      }
    },
    /** 重做 */
    redo() {
      const { list, point } = history.value
      if (point < list.length - 1) {
        designData.value = applyPatches(designData.value, list[point + 1].redo)
        history.value = { list, point: point + 1 }
      } else {
        console.log('没有可重做的操作')
      }
    },
    /** 解析路径 */
    parsePathNode,
    /** 记录历史 */
    recordHistory,
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
        recordHistory(
          produceWithPatches(designData.value, draft => {
            const { lastNodeParent, lastIndex } = parsePathNode(draft, position.value)
            lastNodeParent.children!.splice(lastIndex, 1)
          })
        )
      }
    }
    /** 放置事件 */
    // onDrop(monitor: Monitor) {

    // }
  }

  provide(DRAG_CONTEXT_KEY, provideData)

  return provideData

}