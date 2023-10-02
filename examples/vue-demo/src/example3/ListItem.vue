<template>
  <li :ref="dropDragRef">
    {{ props.index }} {{ props.item }}
  </li>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useDrag, useDrop } from 'easy-dnd/vue'

const emits = defineEmits<{
  (e: 'onDragEnd', fromIndex: number, toIndex: number, isTop: boolean): void
}>()

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  item: {
    type: String,
    required: true
  }
})

const drag = useDrag({
  config: {
    type: 'list',
    // 把索引作为存放数据
    data: () => props.index,
    className: {
      dragging: 'dragging'
    }
  }
})

const drop = useDrop<number, any>({
  config: {
    acceptType: new Set(['list'])
  },
  // 进入时触发的函数
  dragOver(monitor) {
    // 拖动到前50%
    if (monitor.isOverTop()) {
      drop.dropDom.className = 'example3-enter-top'
    }
    // 拖动到后50%
    else {
      drop.dropDom.className = 'example3-enter-bottom'
    }
  },
  // 离开
  dragLeave() {
    // 拖动的控件离开此控件，还原样式
    drop.dropDom.className = ''
  },
  // 松开
  drop(monitor) {
    const isTop = monitor.isOverTop()
    console.log(
      `${monitor.getDragData()}拖动到${props.index}的${isTop ? '上' : '下'}面`
    )
    // 修改数据
    emits('onDragEnd', monitor.getDragData(), props.index, isTop)
    // 去除样式
    this.dragLeave && this.dragLeave(monitor)
  }
})

// 当前控件既可以拖拽，也可以放置
const dropDragRef = drop.dropRef(drag.dragRef)

</script>

<style>
.example3-enter-top::before {
  top: 0;
  background: rgb(184, 149, 255);
}

.example3-enter-bottom::after {
  bottom: 0;
  background: rgb(184, 149, 255);
}
</style>