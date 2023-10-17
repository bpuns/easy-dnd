<template>
  <!-- <DndProvider :type="DND_MODE.SWARAJ" :delay="0"> -->
  <!-- <dnd-provider :type="DND_MODE.SWARAJ" :delay="0"> -->
  <dnd-provider>
    <A></A>
    <B></B>
  </dnd-provider>
</template>

<script setup lang="ts">
import { DndProvider, DND_MODE } from 'easy-dnd/vue'
import * as dnd from 'easy-dnd/vue'
import A from './A.vue'
import B from './B.vue'
</script>