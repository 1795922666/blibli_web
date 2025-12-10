<template>
  <n-infinite-scroll :distance="20" @load="handleLoad">
    <div class="zj-comment_tab">
      <span :class="{ btn: true, active: newtab == 'hot' }" @click="change('hot')">最热</span>
      <n-divider vertical />
      <span :class="{ btn: true, active: newtab == 'new' }" @click="change('new')">最新</span>
    </div>
    <div class="zj-comment_content">
      <comment-input @send="handleSend"></comment-input>
      <template v-for="item in data?.data" :key="item?.id">
        <comment-renderer :comment-info="item" :reply="item?.reply"></comment-renderer>
      </template>
    </div>
  </n-infinite-scroll>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { CommentListProps } from '../types'
import { comment } from '@api'
import { useCommentStore } from '@renderer/store/comment'
const commenStore = useCommentStore()
const props = defineProps<CommentListProps>()
const newtab = ref('hot')
const change = (value: string): void => {
  newtab.value = value
}

const handleLoad = async (): Promise<void> => {
  const comments = props!.data!.data
  if (props.data?.total && props.data?.total > props.data?.data.length) {
    const lastTime = comments.slice(-1)[0].userInfo.signature || null
    await commenStore.handleCommentList(props.videoId, lastTime)
  }
}
// 发送评论
const handleSend = async (content: string): Promise<void> => {
  const res = await comment(props.videoId, content)
  if (res) {
    commenStore.putCommentList(res.data.data)
  }
}
onMounted(() => {
  commenStore.getCommentList(props.videoId)
})
</script>

<style lang="scss" scoped>
.active {
  color: #ffff;
}
.btn:hover {
  color: #007b88;
}
</style>
