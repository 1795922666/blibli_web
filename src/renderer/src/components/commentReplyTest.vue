<template>
  <div class="zj-comment-renderer">
    <personal-info
      :name-style="{ fontSize: '14px', color: '#ff77a3', marginBottom: '0' }"
      button-type="comment"
      :size="30"
      :user-info="commentReplyInfo?.userInfo"
    ></personal-info>
    <div class="zj-comment-renderer_info">
      <div class="zj-comment-renderer_info--text">
        <n-ellipsis expand-trigger="click" line-clamp="4" :tooltip="false">
          <template
            v-if="
              commentReplyInfo.commentId !== commentReplyInfo.pcommentId &&
              commentReplyInfo.userInfo.id !== commentReplyInfo.replyUserId
            "
          >
            <span> 回复 </span>
            <span class="btn" style="color: #0087bd"> @{{ commentReplyInfo.replyNickName }}</span>
          </template>

          {{ commentReplyInfo?.replyContent }}
        </n-ellipsis>
      </div>
      <div class="zj-comment-renderer_info--buttons">
        <span class="iconfont icon-clike"></span>
        <span class="iconfont icon-comment btn" @click="showInput = !showInput"></span>
      </div>
      <comment-input v-show="showInput" @send="handleSend"></comment-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { replys } from '@api'
import type { CommentReplyTestProps, ReplyCommentParam } from '../views/video/types'
const showInput = ref(false)

const props = defineProps<CommentReplyTestProps>()

const handleSend = async (content: string): Promise<void> => {
  const replyParam: ReplyCommentParam = {
    commentId: props.commentReplyInfo.replyId,
    pCommentId: props.commentReplyInfo.pcommentId,
    replyUserId: props.commentReplyInfo.replyUserId,
    content
  }
  const res = await replys(replyParam)
  if (res) {
    console.log('回复成功')
  }
  // console.log(props.commentReplyInfo)
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
