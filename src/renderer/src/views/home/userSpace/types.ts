export interface UserInfo {
  id: string
  nickName: string
  avatar: string
  signature: string
  followingCount?: number
  followerCount?: number
  followed?: boolean
  self?: boolean
  likeCount?: number
}
