<template>
  <DndProvider>
    <div style="display: flex;">
      <div style="width: 200px;">
        11
      </div>
      <div style="flex: 1;">
        <Form :node="designData" />
      </div>
    </div>
  </DndProvider>
</template>

<script lang="ts" setup>
import { DndProvider } from 'easy-dnd/vue'
import { Form } from './component'
import { useFormDragContext } from './utils'

const { designData } = useFormDragContext()
</script>

<style lang="scss">
.design-node {
  position: relative;
  border: 1px solid #000;
  padding: 10px;
  margin: 10px;

  >button {
    margin-left: 10px;
  }

  &::before,
  &::after {
    inset: 0;
    content: '';
    display: block;
    position: absolute;
    pointer-events: none;
  }

  &:hover {
    border: 1px dashed rgb(0, 89, 255);
  }

}

.enter-top::before {
  bottom: unset;
  top: -5px;
  height: 5px;
  background: rgb(255, 0, 0);
}

.enter-bottom::after {
  top: unset;
  bottom: -5px;
  height: 5px;
  background: rgb(255, 0, 0);
}

.enter-center::before {
  background: rgba(255, 0, 0, 0.05);
}

.dragging {
  opacity: 0.1;
}
</style>