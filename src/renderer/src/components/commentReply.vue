<template>
  <div class="zj-comment-reply">
    <div v-for="(item, index) in replies" :key="index" class="zj-comment-reply_info">
      <span class="zj-comment-reply_info--name btn">{{ item?.nickName }}</span>
      <template v-if="item.commentId !== pcommentInfo.id">
        <span> 回复 </span>
        <span class="btn" style="color: #0087bd">@{{ item?.replyNickName }}</span>
      </template>
      <span class="zj-comment-reply_info--text"> : {{ item?.replyContent }}</span>
    </div>
    <div v-show="replyCount > 2" class="zj-comment-reply_ellipsis btn" @click="showDetailed">
      共{{ replyCount }}条回复
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRaw } from 'vue'
import type { ReplyProps, CommentInfo, CommentReplyInfo } from '../views/video/types'
import { getCommentDetails } from '@renderer/server/api'
import { useCommentStore } from '@renderer/store/comment'
const commenStore = useCommentStore()
const props = defineProps<{
  pcommentInfo: CommentInfo
  replyCount: number
  replies: ReplyProps[]
}>()
// 显示回复详细
const showDetailed = async (): Promise<void> => {
  console.log(props)

  const res = await getCommentDetails(props.pcommentInfo.id)
  if (res) {
    const value: ReplyProps[] = res.data.data
    const commentInfo = { ...toRaw(props.pcommentInfo), replyCount: 0 }
    const reply = value.map((item): CommentReplyInfo => {
      return {
        replyId: item.replyId,
        pcommentId: item.pcommentId,
        commentId: item.commentId,
        userInfo: {
          id: item.userId,
          nickName: item.nickName,
          signature: item.replyUpdateTime
        },
        replyUserId: item.replyUserId,
        replyNickName: item.replyNickName,
        replyContent: item.replyContent
      }
    })
    commenStore.changeDom('commentDetail', { commentInfo, reply })
  }
}
</script>

<style lang="scss" scoped>
@include b(comment-reply) {
  padding: 10px;
  font-size: 14px;
  margin-bottom: 10px;
  background-color: #1f2022;
  .btn:hover {
    color: #0087ae;
  }
  @include e(info) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 7px;
    @include m(name) {
      color: #a2a7ae;
    }
  }
  @include e(ellipsis) {
    font-size: 13px;
    color: #0087bd;
  }
}
</style>
