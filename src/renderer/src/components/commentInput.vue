<template>
  <div class="zj-comment-input">
    <n-input
      v-model:value="content"
      style="--n-border: 0px; background-color: #0d0d0e; --n-text-color: #fff"
      class="button"
      type="textarea"
      placeholder="说点什么吧..."
      passively-activated
      :autosize="{
        minRows: 1,
        maxRows: 3
      }"
    />
    <div style="text-align: end"><n-button type="primary" @click="handleSend">发布</n-button></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const content = ref('')
const emit = defineEmits(['send'])
const handleSend = (): void => {
  emit('send', content.value)
  content.value = ''
}
</script>

<style lang="scss" scoped>
@include b(comment-input) {
  margin-bottom: 5px;
}
.button {
  margin: 10px 0;
}
</style>
