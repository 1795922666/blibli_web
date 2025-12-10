<template>
  <div class="zj-comment-renderer">
    <personal-info
      :name-style="{ fontSize: '14px', color: '#ff77a3', marginBottom: '0' }"
      button-type="comment"
      :size="30"
      :user-info="commentInfo?.userInfo"
    ></personal-info>
    <div class="zj-comment-renderer_info">
      <div class="zj-comment-renderer_info--text">
        <n-ellipsis expand-trigger="click" line-clamp="4" :tooltip="false">
          {{ commentInfo?.content }}
        </n-ellipsis>
      </div>
      <div class="zj-comment-renderer_info--buttons">
        <span class="iconfont icon-clike"></span>
        <span class="iconfont icon-comment btn" @click="showInput = !showInput"></span>
      </div>
      <comment-input v-show="showInput" @send="handleSend"></comment-input>
      <comment-reply
        v-if="commentInfo.replyCount > 0"
        :pcomment-info="commentInfo"
        :reply-count="commentInfo.replyCount"
        :replies="reply"
      ></comment-reply>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { replys } from '@api'
import type { RendererProps, ReplyCommentParam } from '../views/video/types'
const showInput = ref(false)

const props = defineProps<RendererProps>()

const handleSend = async (content: string): Promise<void> => {
  const replyParam: ReplyCommentParam = {
    commentId: props.commentInfo.id,
    pCommentId: props.commentInfo.id,
    replyUserId: props.commentInfo.userInfo.id,
    content
  }
  const res = await replys(replyParam)
  if (res) {
    console.log('回复成功')
  }
}
</script>

<style lang="scss" scoped>
@include b(comment-renderer) {
  margin-top: 10px;
  border-bottom: 1px solid #2f3134;
  @include e(info) {
    margin-top: 5px;
    padding-left: 40px;
    font-size: 15px;
    line-height: 18px;
    color: #ffff;
    @include m(buttons) {
      margin: 10px 0;
    }
  }
}

.iconfont {
  font-size: 15px;
  color: #888c92;
  margin-right: 10px;
}
</style>
