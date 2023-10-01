import { useCallback, useMemo, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'easy-dnd/react'
import './index.css'

function Example3() {
  return (
    <DndProvider>
      <List />
    </DndProvider>
  )
}

function List() {

  const [ list, setList ] = useState([ 'a', 'b', 'c', 'd', 'e', 'f' ])

  const onDragEnd = useCallback((fromIndex, toIndex, isTop) => {
    // 有两种情况不需要调换位置
    // 向上拖拽，并且toIndex就在fromIndex的上面
    if (isTop && fromIndex === toIndex - 1) return
    // 向下拖拽，并且toIndex就在fromIndex的下面
    if (!isTop && fromIndex === toIndex + 1) return
    
    const newList = [ ...list ]
    const removeItem = newList.splice(fromIndex, 1)
    newList.splice(toIndex, 0, removeItem[0])
    setList(newList)

  }, [ list ])

  return (
    <ul className='example3'>
      {
        list.map((item, index) => (
          <Item
            key={item}
            index={index}
            value={item}
            onDragEnd={onDragEnd}
          />
        ))
      }
    </ul>
  )

}

function Item({ value, index, onDragEnd }) {

  const dragInstance = useDrag(() => ({
    config: {
      type: 'list',
      // 把索引作为存放数据
      data: () => index
    },
    dragStart() {
      dragInstance.dragDom.style.opacity = '.2'
    },
    dragEnd() {
      dragInstance.dragDom.style.opacity = '1'
    }
  }), [ index ])

  const dropInstance = useDrop(() => ({
    config: {
      acceptType: new Set([ 'list' ])
    },
    // 进入时触发的函数
    dragOver(monitor) {
      // 拖动到前50%
      if (monitor.isOverTop()) {
        dropInstance.dropDom.className = 'example3-enter-top'
      }
      // 拖动到后50%
      else {
        dropInstance.dropDom.className = 'example3-enter-bottom'
      }
    },
    // 离开
    dragLeave() {
      // 拖动的控件离开此控件，还原样式
      dropInstance.dropDom.className = ''
    },
    // 松开
    drop(monitor) {
      const isTop = monitor.isOverTop()
      console.log(
        `${monitor.getDragData()}拖动到${index}的${isTop ? '上' : '下'}面`
      )
      // 修改数据
      onDragEnd(monitor.getDragData(), index, isTop)
      // 去除样式
      this.dragLeave && this.dragLeave(monitor)
    }
  }), [ index, onDragEnd ])

  // 当前控件既可以拖拽，也可以放置
  const dropDragRef = useMemo(() => dropInstance.dropRef(dragInstance.dragRef), [])

  return (
    <li ref={dropDragRef}>
      {index} {value}
    </li>
  )
}

Example3.tip = '拖拽排序'

export {
  Example3
}