import type { IDropCoreMonitor } from '../@types'
import type { Drop } from '../Drop'

function createDropMonitor<Data, Rubbish>(instance: Drop<Data, Rubbish>): IDropCoreMonitor<Data, Rubbish> {

  const getDomRect = () => instance.dropDom.getBoundingClientRect()

  const canDropMonitor = {
    event: null!,
    getContext: () => instance.context,
    getDropInstance: () => instance.context.dropInstance,
    getDragType: () => instance.context.dragType,
    getDragData: () => instance.context.dragData,
  }

  return {
    ...canDropMonitor,
    getDragDom: () => instance.context.dragDom,
    getDomRect,
    isOverTop: (domRect?: DOMRect, middleExists?: boolean) => {
      const { y, height } = domRect || getDomRect()
      return instance.context.dragCoord.y < (y + height / (middleExists ? 3 : 2))
    },
    isOverBottom: (domRect?: DOMRect, middleExists?: boolean) => {
      const { y, height } = domRect || getDomRect()
      return instance.context.dragCoord.y > (y + height / (middleExists ? 1.5 : 2))
    },
    isOverLeft: (domRect?: DOMRect, middleExists?: boolean) => {
      const { x, width } = domRect || getDomRect()
      return instance.context.dragCoord.x < (x + width / (middleExists ? 3 : 2))
    },
    isOverRight: (domRect?: DOMRect, middleExists?: boolean) => {
      const { x, width } = domRect || getDomRect()
      return instance.context.dragCoord.x > (x + width / (middleExists ? 1.5 : 2))
    },
    isOverRowCenter(domRect?: DOMRect) {
      domRect = domRect || getDomRect()
      return !this.isOverTop(domRect, true) && !this.isOverBottom(domRect, true)
    },
    isOverColumnCenter(domRect?: DOMRect) {
      domRect = domRect || getDomRect()
      return !this.isOverLeft(domRect, true) && !this.isOverRight(domRect, true)
    },
    // @ts-ignore 给这个库自己用的
    simple: canDropMonitor
  }
}

export {
  createDropMonitor
}