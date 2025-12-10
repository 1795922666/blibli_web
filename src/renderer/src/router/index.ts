import { router } from '@renderer/router/router'
import type { App } from 'vue'
import { useAuthStore } from '@store'
import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router'
import { RouteNames } from './router-name'
export const routerInstance = createRouter({
  history: createWebHistory(),
  routes: router
})

export function setupRouter(app: App): void {
  app.use(routerInstance)
}

/**
 * 检查路由是否在白名单中
 */
function isInWhiteList(route: RouteLocationNormalized): boolean {
  return !!route.meta?.whiteList
}

/**
 * 检查路由是否需要认证
 */
function isRouteRequiresAuth(route: RouteLocationNormalized): boolean {
  return route.meta?.requiresAuth === true || route.meta?.requiresAuth === 'soft'
}

/**
 * 初始化用户认证状态（静默登录）
 */
async function initializeAuth(): Promise<void> {
  const authStore = useAuthStore()
  if (!authStore.isInitialized) {
    await authStore.initialize()
  }
}

/**
 * 处理需要认证的路由
 */
async function handleAuthRequiredRoute(
  to: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> {
  const authStore = useAuthStore()
  if (authStore.isLoggedIn) {
    // 已登录用户检查权限
    if (to.meta.permissions && !authStore.hasPermissions(to.meta.permissions)) {
      next({ path: RouteNames.HOME.INDEX })
      return
    }
    next()
  } else {
    // 未登录用户处理

    if (to.meta.requiresAuth === 'soft') {
      // 软认证要求 - 允许进入页面但限制功能
      next()
    } else {
      // 硬认证要求 - 必须登录才能访问
      window.api.showWindow('child_window_login')
      next(RouteNames.HOME.INDEX)
    }
  }
}

// 路由守卫
routerInstance.beforeEach(async (to, from, next) => {
  // 1. 白名单路由直接放行

  if (isInWhiteList(to)) {
    next()
    return
  }

  // 2. 初始化认证状态（静默登录）
  await initializeAuth()

  // 3. 检查路由认证要求
  if (isRouteRequiresAuth(to)) {
    await handleAuthRequiredRoute(to, next)
  } else {
    next()
  }
})

// 路由错误处理
routerInstance.onError((error) => {
  console.error('路由错误:', error)
})
