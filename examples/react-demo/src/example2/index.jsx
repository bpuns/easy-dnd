import { useCallback, useRef, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'easy-dnd/react'
import './index.css'

function Example2() {
  return (
    <DndProvider>
      <A />
      <B />
    </DndProvider>
  )
}

function A() {

  const inputRef = useRef(null)

  const dragInstance = useDrag(() => ({
    config: {
      type:      'A',
      data:      () => inputRef.current.value,
      className: {
        dragging: 'dragging'
      }
    }
  }), [])

  return (
    <div
      ref={dragInstance.dragRef}
      className='example2 example2-a'
    >
      <input
        ref={inputRef}
        placeholder='请输入具体的值,然后拖到B中'
      />
    </div>
  )
}

function B() {

  const [ child, setChild ] = useState('1')

  const dropInstance = useDrop(() => ({
    config: {
      acceptType: new Set([ 'A' ]),
      canDrop(monitor) {
        // 如果B中已经存在一个子元素，不允许放置
        if (child) {
          console.log('b中已经存在子元素，不能拖拽')
          return false
        }
        // 或者拖拽的数据中没有值，也不允许放置
        if (!monitor.getDragData()) {
          console.log('请在输入框中输入一点值再拖拽')
          return false
        }
        return true
      }
    },
    drop(monitor) {
      setChild(monitor.getDragData())
    }
  }), [ child ])

  const removeChild = useCallback(() => setChild(null), [])

  return (
    <div
      ref={dropInstance.dropRef}
      className='example2 example2-b'
    >
      <p style={{ lineHeight: '20px' }}>
        B(当前节点只能放置一个节点，如果想要放置新节点，请移除下面的子节点)
      </p>
      {
        child && (
          <div className='example2-b-children'>
            {child}
            <button onClick={removeChild}>移除这个子元素</button>
          </div>
        )
      }
    </div>
  )
}

Example2.tip = '携带数据的拖拽'

export {
  Example2
}