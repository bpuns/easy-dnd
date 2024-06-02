<template>
  <div :ref="drag.dragRef" class="example2 example2-a">
    <input
      v-model="input"
      placeholder="请输入具体的值,然后拖到B中"
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDrag } from 'easy-dnd/vue'

const input = ref('')

const drag = useDrag({
  config: {
    type:      'A',
    data:      () => input.value,
    className: {
      dragging: 'dragging'
    }
  }
})

</script>

<style>
.example2 {
  margin    : 50px;
  transition: .3 all ease;
  text-align: center;
}

.example2-a {
  width      : 300px;
  height     : 50px;
  border     : 1px solid #000;
  line-height: 50px
}

.example2-a > input {
  width: 90%;
}
</style>