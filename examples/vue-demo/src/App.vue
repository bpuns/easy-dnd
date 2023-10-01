<template>
  <DndProvider :type="DND_MODE.SWARAJ" :delay="0">
    <button @click="onAdd">{{ count }}</button>
    <A></A>
  </DndProvider>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import A from './A.vue'
// import DndProvider from './DndProvider.vue'
import { DndProvider } from './utils'
import { DND_MODE } from 'easy-dnd'


const count = ref(0)

const onAdd = () => {
  count.value++
}
</script>