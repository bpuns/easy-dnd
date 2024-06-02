<template>
  <button @click="allowDrag = !allowDrag">
    {{ allowDrag ? '关闭' : '开启' }}拖拽
  </button>
  <div :ref="drag.dragRef" class="a">
    盒子A
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDrag } from 'easy-dnd/vue'

// 设置是否允许拖拽
const allowDrag = ref(false)

const drag = useDrag({
  config: {
    // 默认是否允许拖拽
    defaultDraggable: allowDrag.value,
    type:             'A',
    className:        {
      hover: 'hover'
    }
  }
})

watch(allowDrag, value => drag.draggable = value)

</script>

<style scoped>
.a {
  width: 100px;
  height: 100px;
  border: 1px solid rgb(0, 0, 0);
}
</style>