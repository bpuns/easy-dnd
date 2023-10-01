import { useCallback, useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'easy-dnd/react';
import s from './order.module.css';

export function GridOrderList({ getKey, orderList, render, onChange }) {
  const dragInfo = useRef(null);

  const [dragDropType] = useState(() => Symbol());
  const newOrderList = useRef(orderList);
  useEffect(() => { newOrderList.current = orderList }, [orderList]);

  const onDragStart = useCallback((dragIndex) => {
    dragInfo.current = {
      dragIndex,
      oldList: newOrderList.current
    };
  }, []);

  const onDragEnd = useCallback(() => dragInfo.current = null, []);

  const onDragUpdate = useCallback(
    (enterItem) => {
      const { dragIndex, oldList } = dragInfo.current;
      const dropIndex = newOrderList.current.indexOf(enterItem);
      if (dropIndex === dragIndex) {
        onChange(oldList);
      } else {
        const nextList = [...oldList];
        const removeItem = nextList.splice(dragIndex, 1);
        nextList.splice(dropIndex, 0, removeItem[0]);
        onChange(nextList);
      }
    }, []
  );

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
  );
}

function DragDropItem({ onDragUpdate, onDragStart, onDragEnd, item, index, dragDropType, render }) {
  const removeAllClassList = useCallback((dom) => {
    const { classList } = dom;
    classList.remove(s.enterTop);
    classList.remove(s.enterBottom);
    return classList;
  }, []);

  const dragInstance = useDrag(() => ({
    config: {
      type: dragDropType,
      data: () => item
    },
    dragStart() {
      onDragStart(index);
      dragInstance.dragDom.style.opacity = '.2';
    },
    dragEnd() {
      onDragEnd();
      dragInstance.dragDom.style.opacity = '1';
    }
  }), [item, index]);

  const dropInstance = useDrop(() => ({
    config: {
      acceptType: new Set([dragDropType])
    },
    dragOver() {
      onDragUpdate(item);
    },
    dragLeave() {
      removeAllClassList(dropInstance.dropDom);
    },
    drop(monitor) {
      this.dragLeave && this.dragLeave(monitor);
    }
  }), [item]);

  return (
    render({
      dragRef: dragInstance.dragRef,
      dropRef: dropInstance.dropRef,
      item,
      index
    })
  );
}