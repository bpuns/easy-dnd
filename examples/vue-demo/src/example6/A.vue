<template>
  <div :ref="drag.dragRef" class="example6-dragItem">盒子A</div>
</template>

<script setup lang="ts">
import { useDrag } from "easy-dnd/vue";

const drag = useDrag({
  config: {
    type: "A",
  },
});
</script>

<style>
.example6-dragItem {
  width: 50px;
  height: 50px;
  box-sizing: border-box;
  border: 1px solid rgb(0, 0, 0);
}
</style>
