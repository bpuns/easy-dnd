import type { IDnDProvider } from '../@types'
import { DND_MODE } from '../@types'

/**
 * 创建拖拽作用域下的基本数据
 * @param dndMode   拖拽类型，有 SCOPE 和 SWARAJ 两种可选
 * @param delay     拖拽延时时间，必须大于等于0
 * @returns 
 */
function createProvider<Data, Rubbish>(dndMode: DND_MODE, delay: number = 0): IDnDProvider<Data, Rubbish> {

  if (delay < 0 || isNaN(delay)) delay = 0

  return {
    dndMode,
    delay,
    dropInstance: null,
    dragCoord:    {
      x: 0,
      y: 0
    },
    dragType:           null!,
    dragDom:            null!,
    dragData:           null!,
    enterDom:           null!,
    dragItemDragStarts: new Set(),
    dragItemDragEnds:   new Set(),
    dropItemDragStarts: new Set(),
    dropItemDragEnds:   new Set(),
    rubbish:            {} as any
  }
}

export {
  createProvider
}