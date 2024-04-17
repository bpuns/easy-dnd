import { useCallback, useState, useRef, useEffect } from 'react'
import { type Drop, type Drag, DndProvider, useDrag, useDrop } from 'easy-dnd/react'

interface GridOrderListProps<T> {
  /** 获取用于渲染子项的key */
  getKey: (item: T) => any
  /** 要渲染的列表 */
  orderList: T[]
  /** 单节点渲染 */
  render: (params: {
    dropRef: Drop['dropRef'],
    dragRef: Drag['dragRef'],
    item: T,
    index: number
  }) => JSX.Element
  /** 修改回调 */
  onChange: (newList: T[]) => any
}

export function GridOrderList<T>({ getKey, orderList, render, onChange }: GridOrderListProps<T>) {
  const dragInfo = useRef<{
    dragIndex: number,
    oldList: T[]
  }>(null!)

  const [ dragDropType ] = useState(() => Symbol())
  const newOrderList = useRef(orderList)
  useEffect(() => { newOrderList.current = orderList }, [ orderList ])

  const onDragStart = useCallback((dragIndex: number) => {
    dragInfo.current = {
      dragIndex,
      oldList: newOrderList.current
    }
  }, [])

  const onDragEnd = useCallback(() => dragInfo.current = null!, [])

  const onDragUpdate = useCallback(
    (enterItem: T) => {
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

interface DragDropItemProps<T> extends Pick<GridOrderListProps<T>, 'render'> {
  /** 当前渲染项 */
  item: T,
  /** 当前渲染项的索引 */
  index: number,
  /** 拖拽类型 */
  readonly dragDropType: symbol,
  /** 开始拖拽 */
  onDragStart: (dragIndex: number) => any,
  /** 结束拖拽 */
  onDragEnd: () => any,
  /** 拖拽进入触发更新 */
  onDragUpdate: (enterItem: T) => any
}

function DragDropItem<T>({
  onDragUpdate,
  onDragStart,
  onDragEnd,
  item,
  index,
  dragDropType,
  render
}: DragDropItemProps<T>) {

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