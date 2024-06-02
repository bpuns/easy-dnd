<template>
  <ul class="example4-ul">
    <dnd-provider>
      <drag-drop-item
        v-for="(item, index) in list"
        :key="item"
        :item="item"
        :index="index"
        @onDragStart="onDragStart"
        @onDragEnd="onDragEnd"
        @onDragUpdate="onDragUpdate"
      />
    </dnd-provider>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DndProvider } from 'easy-dnd/vue'
import DragDropItem from './DragDropItem.vue'

const list = ref([
  'a', 'b', 'c', 'd', 'e', 'f', 'j', 'h', 'i', 'g', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
])

// 存储旧的拖拽数组
let cacheList: string[],
  // 拖拽索引
  dragIndex: number

// 开始拖拽
const onDragStart = (_dragIndex: number) => {
  cacheList = [ ...list.value ]
  dragIndex = _dragIndex
}

const onDragEnd = () => {
  cacheList = dragIndex = null!
}

const onDragUpdate = (enterItem: string) => {
  // 做个缓存处理，避免重复渲染
  const dropIndex = list.value.indexOf(enterItem)
  // 重新渲染列表
  if (dropIndex === dragIndex) {
    list.value = cacheList
  } else {
    const nextList = [ ...cacheList ]
    const removeItem = nextList.splice(dragIndex, 1)
    nextList.splice(dropIndex, 0, removeItem[0])
    list.value = nextList
  }
}

</script>

<style>
.example4-ul {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  justify-items: center;
  gap: 10px;
}
</style>