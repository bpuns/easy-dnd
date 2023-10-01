<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { provide, withDefaults, defineProps } from 'vue'
import { DND_MODE, createProvider, DND_CTX } from 'easy-dnd'

const props = withDefaults(
  defineProps<{
    type: DND_MODE;
    delay: number;
  }>(),
  {
    type: () => DND_MODE.SWARAJ,
    delay: () => 0
  }
)

provide(DND_CTX, createProvider(props.type, props.delay))

</script>