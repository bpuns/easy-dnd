<template>
  <dnd-provider>
    <A />
    <B />
  </dnd-provider>
</template>

<script setup lang="ts">
import { DndProvider } from 'easy-dnd/vue'
import A from './A.vue'
import B from './B.vue'
</script>