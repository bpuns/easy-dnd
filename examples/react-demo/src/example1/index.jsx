import { DndProvider, useDrag, useDrop } from 'easy-dnd/react'

function Example1() {
  return (
    <DndProvider>
      <A />
      <B />
    </DndProvider>
  )
}

function A() {

  const drag = useDrag(() => ({
    config: {
      type: 'A'
    },
    // 拖拽开始的回调
    dragStart: () => {
      console.log('A 开始拖拽')
    },
    // 拖拽结束的回调
    dragEnd: () => {
      console.log('A 结束拖拽')
    }
  }), [])

  return (
    <div
      ref={drag.dragRef}
      style={{ width: 50, height: 50, border: '1px solid #000' }}
    >
      盒子A
    </div>
  )
}

function B() {

  const drop = useDrop(() => ({
    config: {
      acceptType: new Set([ 'A' ])
    },
    dragEnter() {
      console.log('A进入了B的范围')
    },
    // A放置时触发的回调
    drop(monitor) {
      console.log('A放置在B上', '存放的数据:' + monitor.getDragData())
    },
    dragOver() {
      console.log('A在B中移动')
    },
    dragLeave() {
      console.log('A离开了B的范围')
    }
  }), [])

  return (
    <div
      ref={drop.dropRef}
      style={{ width: 100, height: 100, border: '1px dashed #000' }}
    >
      盒子B
    </div>
  )
}

Example1.tip = '简单拖拽'

export {
  Example1
}