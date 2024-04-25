import type { IDnDProvider } from '../@types'

/** 上下文销毁提示 */
export const DESTROY_TIP = '上下文已被注销，请使用新的上下文'
/** 订阅提示 */
export const SUBSCRIBE_TIP = (s: string) => `class ${s}调用subscribe方法前必须调用registerDom方法`

/**
 * 从数组中删除某个元素
 * @param arr 
 * @param deleteItem 
 */
export function spliceItem<T>(arr: T[], deleteItem: T) {
  const index = arr.indexOf(deleteItem)
  ~index && arr.splice(index, 1)
}

type DragCoord = IDnDProvider<any, any>['dragCoord']
const dragCoords: DragCoord[] = []
let unbindGetContextCoords: () => void

/**
 * Firefox浏览器无法获取拖拽中的位置，因此需要在html上绑定drag，获取拖拽位置
 * @param dragCoord 
 * @returns 
 */
export function bindGetContextCoords(dragCoord: DragCoord) {
  if (!unbindGetContextCoords) {
    const dragOver = (e: DragEvent) => {
      dragCoords.forEach(dragCoord=>{
        dragCoord.x = e.clientX
        dragCoord.y = e.clientY
      })
    }
    const html = document.documentElement
    html.addEventListener('dragover', dragOver, true)
    unbindGetContextCoords = () => html.removeEventListener('dragover', dragOver, true)
  }
  dragCoords.push(dragCoord)
  return () => {
    // 先找到push进去的dragCoord的索引，再展示
    spliceItem(dragCoords, dragCoord)
    if (!dragCoords.length) {
      unbindGetContextCoords()
      unbindGetContextCoords = undefined
    }
  }
}