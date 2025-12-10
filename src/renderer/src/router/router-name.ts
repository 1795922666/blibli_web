export const RouteNames = {
  LOGIN: '/login',
  VIDEO: '/video',
  HOME: {
    INDEX: '/home/index',
    CHOICENESS: '/home/choiceness',
    DYNAMIC_STATE: '/home/dynamicState',
    MY: '/home/my',
    USERSPACE: '/home/:userId/userspace',
    POSTFILE: '/home/postfile',
    FOLLOWLIST: '/home/:userId/followlist'
  },
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500'
} as const
