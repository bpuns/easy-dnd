import { useCallback, useState, useRef, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'easy-dnd/react'

export function GridOrderList({ getKey, orderList, render, onChange }) {
  const dragInfo = useRef(null)

  const [ dragDropType ] = useState(() => Symbol())
  const newOrderList = useRef(orderList)
  useEffect(() => { newOrderList.current = orderList }, [ orderList ])

  const onDragStart = useCallback((dragIndex) => {
    dragInfo.current = {
      dragIndex,
      oldList:   newOrderList.current
    }
  }, [])

  const onDragEnd = useCallback(() => dragInfo.current = null, [])

  const onDragUpdate = useCallback(
    (enterItem) => {
      // 重新渲染列表
      const { dragIndex, oldList } = dragInfo.current
      const dropIndex = newOrderList.current.indexOf(enterItem)
      if (dropIndex === dragIndex) {
        onChange(oldList)
      } else {
        const nextList = [ ...oldList ]
        const removeItem = nextList.splice(dragIndex, 1)
        nextList.splice(dropIndex, 0, removeItem[0])
        onChange(nextList)
      }
    }, []
  )

  return (
    <DndProvider>
      {
        orderList.map((t, i) => (
          <DragDropItem
            key={getKey(t)}
            item={t}
            index={i}
            dragDropType={dragDropType}
            render={render}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragUpdate={onDragUpdate}
          />
        ))
      }
    </DndProvider>
  )
}

function DragDropItem({ onDragUpdate, onDragStart, onDragEnd, item, index, dragDropType, render }) {

  const dragInstance = useDrag(() => ({
    config: {
      type:      dragDropType,
      data:      () => item,
      className: {
        dragging: 'dragging'
      }
    },
    dragStart() {
      onDragStart(index)
    },
    dragEnd() {
      onDragEnd()
    }
  }), [ item, index ])

  const dropInstance = useDrop(() => ({
    config: {
      acceptType: new Set([ dragDropType ])
    },
    dragOver() {
      onDragUpdate(item)
    }
  }), [ item ])

  return (
    render({
      dragRef: dragInstance.dragRef,
      dropRef: dropInstance.dropRef,
      item,
      index
    })
  )
}