import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from './router-name'
export const router: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => '/home'
  },
  {
    path: RouteNames.LOGIN,
    name: '登陆',
    component: () => import('@renderer/views/login/index.vue'),
    meta: {
      whiteList: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@renderer/views/home/homePage.vue'),
    children: [
      {
        path: '',
        redirect: () => RouteNames.HOME.INDEX
      },
      {
        path: RouteNames.HOME.INDEX,
        name: '首页',
        component: () => import('@renderer/views/home/index.vue'),
        meta: {
          requiresAuth: 'soft'
        }
      },
      {
        path: RouteNames.HOME.CHOICENESS,
        name: '精选',
        component: () => import('@renderer/views/home/choiceness/index.vue'),
        meta: {
          requiresAuth: 'soft'
        }
      },
      {
        path: RouteNames.HOME.DYNAMIC_STATE,
        name: '动态',
        component: () => import('@renderer/views/home/dynamicState/index.vue'),
        meta: {
          requiresAuth: 'soft'
        }
      },
      {
        path: RouteNames.HOME.MY,
        name: '我的',
        component: () => import('@renderer/views/home/my/index.vue'),
        meta: {
          requiresAuth: 'soft'
        }
      },
      {
        path: RouteNames.HOME.POSTFILE,
        name: '发布',
        component: () => import('@renderer/views/home/postFile/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: RouteNames.HOME.USERSPACE,
        name: '个人空间',
        component: () => import('@renderer/views/home/userSpace/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: RouteNames.HOME.FOLLOWLIST,
        name: '关注列表',
        component: () => import('@renderer/views/home/followList/index.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: RouteNames.VIDEO,
    name: 'notFound',
    component: () => import('@renderer/views/video/index.vue'),
    meta: {
      whiteList: true
    }
  }
]
