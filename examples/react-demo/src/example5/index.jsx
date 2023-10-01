import { useState, useEffect } from 'react'
import { useDrag, DndProvider } from 'easy-dnd/react'

function Example5() {
  return (
    <DndProvider>
      <A />
    </DndProvider>
  )
}

function A() {

  // 设置是否允许拖拽
  const [ allowDrag, setAllowDrag ] = useState(false)

  useEffect(() => {
    dragInstance.draggable = allowDrag
  }, [ allowDrag ])

  const dragInstance = useDrag(() => ({
    config: {
      type:             'A',
      defaultDraggable: allowDrag,
      data:             () => '数据'
    }
  }))

  return (
    <div>
      <button
        onClick={() => setAllowDrag(!allowDrag)}
      >
        {allowDrag ? '关闭' : '开启'}拖拽
      </button>
      <div
        ref={dragInstance.dragRef}
        style={{ width: 100, height: 100, border: '1px dashed #000' }}
      >
        盒子B
      </div>
    </div>
  )
}

Example5.tip = '开启/关闭拖拽'

export {
  Example5
}