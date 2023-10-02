<template>
  <div :ref="drag.dragRef" class="a">
    盒子A
  </div>
</template>

<script setup lang="ts">
import { useDrag } from 'easy-dnd/vue'

const drag = useDrag({
  config: {
    // 给拖拽元素设置一个type（任意类型都可以）
    type: 'A',
    // 拖拽元素存放的数据
    data: () => 'A给B的数据',
    // 样式
    className: {
      // 鼠标移入时要添加的样式名
      hover: 'hover',
      // 拖拽中要添加的样式名
      dragging: 'dragging'
    }
  },
  // 拖拽开始的回调
  dragStart: () => {
    console.log('A 开始拖拽')
  },
  // 拖拽结束的回调
  dragEnd: () => {
    console.log('A 结束拖拽')
  }
})

</script>

<style scoped>
.a {
  width: 50px;
  height: 50px;
  border: 1px solid rgb(0, 0, 0);
}
</style>