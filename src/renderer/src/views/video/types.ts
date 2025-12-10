export interface CommentProps {
  videoId: string
}
export interface UserInfoComment {
  id: string
  nickName: string
  signature: string
}
export interface CommentInfo {
  id: string
  pcommentId: number
  userInfo: UserInfoComment
  content: string
  likeCount: number
  replyCount: number
  isLike: boolean
  reply?: ReplyProps[]
}

export interface CommentInfoPage {
  data: CommentInfo[]
  total: number
  pageSize: number
}

export interface ReplyProps {
  replyId: string
  pcommentId: string
  commentId: string
  userId: string
  nickName: string
  replyContent: string
  replyNickName: string
  replyUpdateTime: string
  replyUserId: string
}
export interface DetailedProps {
  videoId: string
  data: {
    commentInfo: CommentInfo
    reply: CommentReplyInfo[]
  }
}
export interface RendererProps {
  commentInfo: CommentInfo
  reply: ReplyProps[]
}

export interface CommentReplyInfo {
  replyId: string
  pcommentId: string
  commentId: string
  userInfo: UserInfoComment
  replyUserId: string
  replyNickName: string
  replyContent: string
}

export interface CommentReplyTestProps {
  commentReplyInfo: CommentReplyInfo
}
export interface CommentListProps {
  videoId: string
  data?: CommentInfoPage
}

export interface ReplyCommentParam {
  pCommentId: string
  commentId: string
  replyUserId: string
  content: string
}
