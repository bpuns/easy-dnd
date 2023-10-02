<template>
  <dnd-provider>
    <ul className='example3'>
      <list-item 
        v-for="(item, index) in list"
        :key="item"
        :item="item"
        :index="index" 
        @onDragEnd="onDragEnd"
      />
    </ul>
  </dnd-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DndProvider } from 'easy-dnd/vue'
import ListItem from './ListItem.vue'

const list = ref(['a', 'b', 'c', 'd', 'e', 'f'])

const onDragEnd = (fromIndex: number, toIndex: number, isTop: boolean) => {
  // 有两种情况不需要调换位置
  // 向上拖拽，并且toIndex就在fromIndex的上面
  if (isTop && fromIndex === toIndex - 1) return
  // 向下拖拽，并且toIndex就在fromIndex的下面
  if (!isTop && fromIndex === toIndex + 1) return

  const removeItem = list.value.splice(fromIndex, 1)
  list.value.splice(toIndex, 0, removeItem[0])
}
</script>

<style>
.example3 {
  margin: 100px;
  border: 1px solid #000;
}

.example3 > li {
  position   : relative;
  min-height : 30px;
  border     : 1px dashed #000;
  margin     : 0 10px;
  list-style : none;
  line-height: 30px;
}

.example3 > li::after,
.example3 > li::before {
  width   : 100%;
  height  : 10px;
  content : '';
  display : block;
  position: absolute;
}

</style>