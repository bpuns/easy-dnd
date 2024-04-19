<template>
  <div className="example4-li" :ref="dropDragRef">
    <p>
      {{ props.item }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useDrag, useDrop } from 'easy-dnd/vue'

const emits = defineEmits<{
  (e: 'onDragStart', index: number): void;
  (e: 'onDragUpdate', item: string): void;
  (e: 'onDragEnd'): void;
}>()

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  item: {
    type: String,
    required: true
  }
})

const dragDropType = 'grid_item'

const drag = useDrag({
  config: {
    type: dragDropType,
    data: () => props.item,
    className: {
      dragging: 'dragging'
    }
  },
  dragStart() {
    emits('onDragStart', props.index)
  },
  dragEnd() {
    emits('onDragEnd')
  }
})

const drop = useDrop<number, any>({
  config: {
    acceptType: new Set([dragDropType])
  },
  dragOver() {
    emits('onDragUpdate', props.item)
  }
})

// 当前控件既可以拖拽，也可以放置
const dropDragRef = drop.dropRef(drag.dragRef)

</script>

<style>
.example4-li {
  width: 50px;
  height: 50px;
  background: #cacaca;
  border: 1px solid #000;
  border-radius: 4px;
}
</style>