<template>
  <DndProvider>
    <div class="history-bar">
      <button :disabled="history.point === -1" @click="undo">撤销</button>
      <button :disabled="history.point === history.list.length - 1" @click="redo">重做</button>
    </div>
    <div class="design-plane" style="display: flex;">
      <div class="new-add-control">
        <NewControl :type="NODE_TYPE.GRID" />
        <NewControl :type="NODE_TYPE.FORM_CONTROL" />
      </div>
      <div style="flex: 1">
        <Form :node="designData" />
      </div>
      <div class="property-config">
        <div v-if="selected">
          <h3>正在编辑的控件：{{ selected.node.name }}</h3>
          <label>
            名称：
            <input v-model="selected.node.name">
          </label>
        </div>
      </div>
    </div>
  </DndProvider>
</template>

<script lang="ts" setup>
import { DndProvider } from 'easy-dnd/vue'
import { Form, NewControl } from './component'
import { NODE_TYPE, useFormDragContext } from './utils'

const {
  undo,
  redo,
  history,
  selected,
  designData
} = useFormDragContext()

</script>

<style lang="scss">
.history-bar {
  border: 1px solid #000;
  display: flex;
  padding: 10px;
  gap: 10px;

  >button {
    flex: 1;
  }
}

.design-plane {
  >div {
    height: 600px;
    box-sizing: border-box;
    overflow: hidden auto;
    border: 1px solid #000;
  }

  >div:nth-child(2) {
    margin-top: 10px;
  }
}

.design-node {
  position: relative;
  border: 1px solid #000;
  padding: 10px;
  margin: 10px;
  cursor: pointer;

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

.select-node-box {
  position: absolute;
  z-index: 9;
  pointer-events: none;

  > div {
    pointer-events: all;
    position: absolute;
    background: rgba(255, 0, 0, 0.1);
    display: flex;
    right: 0;
    top: 0
  }

}

.new-add-control {
  width: 300px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 10px;
  margin: 10px;
  border: 1px solid #000;

  >div {
    min-width: 0;
    border: 1px dashed #000;
    padding: 10px;
    border-radius: 10px;
    height: min-content;
    display: flex;
    flex-direction: column;
  }
}

.property-config {
  width: 300px;
  min-width: 0;
  padding: 10px;
  margin: 10px;
  border: 1px solid #000;
}
</style>