import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { VideoInfoType } from '../server/api/types/auth'
export const useVideoStore = defineStore('vidwostore', () => {
  const newVideo = ref<VideoInfoType>({
    userInfo: {
      id: '1',
      nickName: 'Theonlyceasar',
      avatar: '',
      signature: '',
      followingCount: 1,
      followerCount: 1,
      followed: false,
      self: true
    },
    videoId: '', //视频id
    title: '', //视频标题
    description: '', //视频简介
    fileUrl: '',
    likeCount: 0, //视频点赞数
    danmakuCount: 0, //弹幕数
    viewCount: 0, //视频播放量
    collectCount: 0, //视频收藏数量
    commentCount: 0, //视频评论数量
    coinCount: 0, //视频投币数量
    publishTime: '2025-05-15 23:45:41', //视频发布时间
    videoStatus: {
      liked: false, //是否点赞
      collect: false, //是否收藏
      insert: false //是否投币
    }
  })
  const setNewVideo = (videoInfo: VideoInfoType): void => {
    newVideo.value = videoInfo
  }
  const setVideoStatus = (status: string, value: boolean): void => {
    if (newVideo.value) {
      newVideo.value.videoStatus[status] = value
    }
  }
  const setVideoCount = (count: string, value: number): void => {
    if (newVideo.value) {
      newVideo.value[count] += value
    }
  }

  return {
    newVideo,
    setVideoStatus,
    setNewVideo,
    setVideoCount
  }
})
