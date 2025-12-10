import { authRequest } from '../index'
// import type { LoginData, registerData, result, userInfo } from '../types/auth'
import type { FlatResponseData } from '@renderer/server/type'
// 获取视频分类列表
export const category = (): Promise<FlatResponseData> => {
  return authRequest({
    url: '/video/category',
    method: 'get'
  })
}

//上传视频信息
export const videoInfo = (formValue): Promise<FlatResponseData> => {
  return authRequest({
    url: '/video/uploadVideo',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: formValue
  })
}

export const recommend = (): Promise<FlatResponseData> => {
  return authRequest({
    url: '/video/recommend',
    method: 'get'
  })
}

export const getVideo = (videoId: string): Promise<FlatResponseData> => {
  return authRequest({
    url: `/video/videoInfo/${videoId}`,
    method: 'get'
  })
}

export const giveLike = (videoId: string): Promise<FlatResponseData> => {
  return authRequest({
    url: `/video/giveLike/${videoId}`,
    method: 'get'
  })
}
export const collcetVideo = (videoId: string): Promise<FlatResponseData> => {
  return authRequest({
    url: `/video/collcetVideo/${videoId}`,
    method: 'get'
  })
}
export const getMaxCoin = (videoId: string): Promise<FlatResponseData> => {
  return authRequest({
    url: `/video/getMaxCoin/${videoId}`,
    method: 'get'
  })
}

export const giveCoin = (videoId: string, coinCount: number): Promise<FlatResponseData> => {
  return authRequest({
    url: '/video/insertCoin',
    method: 'post',
    params: {
      videoId,
      coinCount
    }
  })
}

export const comment = (videoId: string, content: number): Promise<FlatResponseData> => {
  return authRequest({
    url: '/video/comment',
    method: 'put',
    params: {
      videoId,
      content
    }
  })
}

export const getNewCommentLists = (
  videoId: string,
  lastTime?: string | null
): Promise<FlatResponseData> => {
  return authRequest({
    url: '/video/getNewComment',
    method: 'get',
    params: {
      videoId,
      lastTime
    }
  })
}

export const getCommentDetails = (commentId: string): Promise<FlatResponseData> => {
  return authRequest({
    url: '/video/getCommentReply',
    method: 'get',
    params: {
      commentId
    }
  })
}

export const replys = (ReplyParam): Promise<FlatResponseData> => {
  return authRequest({
    url: '/video/reply',
    method: 'put',
    data: ReplyParam
  })
}
