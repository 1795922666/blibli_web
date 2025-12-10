<template>
  <div class="zj-comment">
    <component :is="commenStore?.dom" :video-id="videoId" :data="commenStore?.data"></component>
  </div>
</template>

<script setup lang="ts">
import type { CommentProps } from '../types'
import { useCommentStore } from '@renderer/store/comment'
const commenStore = useCommentStore()
defineProps<CommentProps>()
</script>

<style lang="scss" scoped>
@include b(comment) {
  padding: 0px 15px;
  font-size: 12px;
  height: 100%;
  color: #4c5364;
}
</style>
