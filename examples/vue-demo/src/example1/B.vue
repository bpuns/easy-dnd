<template>
  <div class="b" :ref="drop.dropRef">
    盒子B
  </div>
</template>

<script setup lang="ts">

import { useDrop } from 'easy-dnd/vue'

const drop = useDrop({
  config: {
    // 设置当前控件允许放置的类型，和 new Drag 中的 config.type 一一对应
    acceptType: new Set(['A']),
    // 样式
    className: {
      // 可放置元素进入改dom访问的时候
      dragEnter: 'dragEnter'
    }
  },
  dragEnter() {
    console.log('A进入了B的范围')
  },
  // A放置时触发的回调
  drop(monitor) {
    console.log('A放置在B上', '存放的数据:' + monitor.getDragData())
  },
  dragOver(monitor) {
    console.log('A在B中移动', monitor.isOverTop())
  },
  dragLeave() {
    console.log('A离开了B的范围')
  }
})

</script>

<style scoped>
.b {
  width: 100px;
  height: 100px;
  border: 1px dashed rgb(0, 0, 0)
}
</style>