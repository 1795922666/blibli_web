<template>
  <div class="zj-comment-detailed">
    <div class="zj-comment-detailed_header">
      <span class="iconfont icon-left btn" @click="balckList">详细</span>
    </div>
    <n-infinite-scroll :distance="20" @load="handleLoad">
      <div class="zj-comment-detailed_top">
        <comment-input @send="sendComment"></comment-input>
        <comment-renderer
          :comment-info="data?.commentInfo"
          :reply="data?.commentInfo.reply"
        ></comment-renderer>
      </div>
      <div class="divider"></div>
      <div class="zj-comment-detailed_list">
        <div class="tip">相关回复共{{ data?.reply.length }}条</div>
        <template v-for="item in data?.reply" :key="item.replyId">
          <comment-reply-test :comment-reply-info="item"></comment-reply-test>
        </template>
      </div>
    </n-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import type { DetailedProps } from '../types'
import { useCommentStore } from '@renderer/store/comment'
const commenStore = useCommentStore()
defineProps<DetailedProps>()
const balckList = (): void => {
  const data = []
  commenStore.changeDom('commentList', data)
}
const handleLoad = (): void => {}
const sendComment = async (comment: string): Promise<void> => {}
</script>

<style lang="scss" scoped>
@include b(comment-detailed) {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  font-size: 13px;
  color: #a2a7ae;
  @include e(header) {
    padding: 5px 0;
  }
}
.iconfont {
  color: #ffff;
  font-size: 15px;
}
.icon-left:before {
  padding-right: 10px;
}
.divider {
  height: 15px;
  margin-bottom: 10px;
  background-color: #0d0d0e;
}
</style>
