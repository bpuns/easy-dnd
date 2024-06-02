<template>
  <div :ref="drop.dropRef" class="example6-dropItem" />
</template>

<script setup lang="ts">
import { useDrop } from 'easy-dnd/vue'

const drop = useDrop({
  config: {
    acceptType: new Set([ 'A' ])
  }
})

// 暴露drop实例
defineExpose({
  drop
})
</script>

<style>
.example6-dropItem {
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  border: 1px dashed rgb(0, 0, 0);
}
</style>
