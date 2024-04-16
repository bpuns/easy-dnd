<template>
  <div :ref="drag.dragRef" class="current">盒子A</div>
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
.current {
  width: 50px;
  height: 50px;
  box-sizing: border-box;
  border: 1px solid rgb(0, 0, 0);
}
</style>
