<template>
  <div className='example2 example2-b' :ref="drop.dropRef">
    <p>
      B(当前节点只能放置一个节点，如果想要放置新节点，请移除下面的子节点)
    </p>
    <div v-if="!!child" className='example2-b-children'>
      {{ child }}
      <button @click="child = null!">移除这个子元素</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDrop } from 'easy-dnd/vue'

const child = ref('1')

const drop = useDrop<string, null>({
  config: {
    acceptType: new Set(['A']),
    canDrop(monitor) {
      // 如果B中已经存在一个子元素，不允许放置
      if (child.value) {
        console.log('b中已经存在子元素，不能拖拽')
        return false
      }
      // 或者拖拽的数据中没有值，也不允许放置
      if (!monitor.getDragData()) {
        console.log('请在输入框中输入一点值再拖拽')
        return false
      }
      return true
    }
  },
  drop(monitor) {
    child.value = monitor.getDragData()
  }
})

</script>

<style>
.example2-b {
  border: 1px dashed #000;
  width: 200px;
  min-height: 100px;
  line-height: 100px
}

.example2-b>p {
  line-height: 20px;
}

.example2-hover {
  box-shadow: 0 0 5px 1px red
}

.example2-b-children {
  border: 1px solid #000;
  margin: 10px;
  display: flex;
  flex-direction: column
}
</style>