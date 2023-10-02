<template>
  <h2>Vue</h2>
  <div className='change-button'>
    <button 
      :key="item.tip"
      v-for="(item, index) in examples"
      :class="['app-button', index === select && 'app-button-selected']"
      @click="onChangeTab(index)"
    >
      例子{{index + 1}}： {{ item.tip }}
    </button>
  </div>
  <div style="padding: 10px">
    <component :is="activeComponent"></component>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, markRaw } from 'vue'
import Example1 from './example1/index.vue'
import Example2 from './example2/index.vue'
import Example3 from './example3/index.vue'
import Example4 from './example4/index.vue'
import Example5 from './example5/index.vue'

const STORAGE_KEY = 'vue-demo-select-index'

const examples = [
  { component: Example1, tip: '简单拖拽' },
  { component: Example2, tip: '携带数据的拖拽' },
  { component: Example3, tip: '拖拽排序' },
  { component: Example4, tip: '网格拖拽排序' },
  { component: Example5, tip: '开启/关闭拖拽' },
]
  .map(t => ({
    ...t,
    component: markRaw(t.component)
  }))

const select = ref((() => {
  const select = Number(localStorage.getItem(STORAGE_KEY))
  if (select < examples.length) return select
  return 0
})())

watch(select, value => localStorage.setItem(STORAGE_KEY, `${value}`))

const activeComponent = ref(examples[select.value].component)

const onChangeTab = (index: number) => {
  activeComponent.value = (
    examples[select.value = index].component
  )
}

</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.change-button {
  padding: 10px 0;
  border-bottom: 1px solid rgb(158, 158, 158);
}

.app-button {
  margin: 0 10px;
}

.app-button-selected {
  box-shadow: 0 0 5px 1px red
}

.hover {
  box-shadow: 0px 0px 5px 1px rgb(0, 0, 0, 1)
}

.dragging {
  opacity: 0.5;
}

.dragEnter {
  box-shadow: 0px 0px 5px 1px rgba(181, 206, 255, 1)
}
</style>