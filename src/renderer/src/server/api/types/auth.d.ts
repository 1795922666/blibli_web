export interface LoginData {
  username: string
  password: string
}
export interface registerData {
  username: string
  password: string
  phone: string
}
export interface userInfo {
  id: string
  nickname: string
}
export interface result<T> {
  code: number
  message: string
  data: T
}
// 重命名接口为 VideoInfoType
interface VideoInfoType {
  userInfo: {
    id: string
    nickName: string
    avatar: string
    signature: string
    followingCount: number
    followerCount: number
    followed: boolean
    self: boolean
  }
  videoId: string
  title: string
  description: string
  fileUrl: string
  likeCount: number
  danmakuCount: number
  collectCount: number //视频收藏数
  viewCount: number
  commentCount: number
  coinCount: number
  publishTime: string
  videoStatus: {
    liked: boolean //是否点赞
    collect: boolean //是否收藏
    insert: boolean //是否投币
  }
}
