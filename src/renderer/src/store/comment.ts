// @ts-nocheck
import { defineStore } from 'pinia'
import { ref, type Component, markRaw, reactive } from 'vue'
import commentList from '@renderer/views/video/components/commentList.vue'
import commentDetail from '@renderer/views/video/components/commentDetailed.vue'
import type {
  CommentInfo,
  DetailedProps,
  CommentInfoPage,
  CommentReplyInfo
} from '@renderer/views/video/types'
import { getNewCommentLists } from '@renderer/server/api'
export const useCommentStore = defineStore('commentstore', () => {
  const detailState = reactive({
    commentId: '',
    status: false,
    data: {} as DetailedProps
  })
  const listState = reactive({
    videoId: '',
    status: false,
    data: {} as CommentInfoPage
  })

  /**
   * @description 评论组件切换
   */
  const dom = ref<Component>(markRaw(commentList))

  /**
   * @description 评论数据|评论详情数据
   */
  const data = ref<CommentInfoPage | DetailedProps>()

  const changeDom = (domName: string, datas): void => {
    domName == 'commentDetail'
      ? (dom.value = markRaw(commentDetail))
      : (dom.value = markRaw(commentList))
    data.value = datas
  }

  /**
   * @description 获取视频评论
   * @param videoId
   */
  const getCommentList = async (videoId: string): Promise<void> => {
    if (!listState.status || listState.videoId !== videoId) {
      const res = await getNewCommentLists(videoId)
      if (res) {
        const value = res.data.data
        listState.status = true
        listState.videoId = videoId
        listState.data = value
      }
    }
    data.value = listState.data
  }

  /**
   *下拉获取视频评论
   * @param video
   * @param lastTime
   */
  const handleCommentList = async (video: string, lastTime: string | null): Promise<void> => {
    const res = await getNewCommentLists(video, lastTime)
    if (res) {
      const newValue = data.value as CommentInfoPage
      newValue.data = [...newValue.data, ...res.data.data.data]
    }
  }

  /**
   * @description 获取评论详情
   * @param commentId
   */
  const getCommentDetail = async (commentId: string): Promise<void> => {}

  /**
   * @description 新增评论
   * @param comment
   */
  const putCommentList = (comment: CommentInfo): void => {
    if (Array.isArray(data.value?.data)) data.value.data.push(comment)
  }

  /**
   * @description 新增评论回复
   * @param reply
   */
  const putReplyList = (reply: CommentReplyInfo, index: number): void => {
    if (Array.isArray(data.value?.data[index].reply)) {
      data.value.data[index].reply.unshift(reply)
    } else {
      data.value!.data[index].reply = [reply]
    }
    data.value!.data[index].replyCount++
  }
  return {
    data,
    dom,
    changeDom,
    getCommentList,
    getCommentDetail,
    putCommentList,
    handleCommentList,
    putReplyList
  }
})
