<template>
  <dnd-provider>
    <Layer />
  </dnd-provider>
</template>

<script setup lang="ts">
import { DndProvider } from 'easy-dnd/vue'
import Layer from './Layer.vue'
</script>