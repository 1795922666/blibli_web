import { defineStore } from 'pinia'
import { ref } from 'vue'
import { token, getUserInfo } from '../server/api/userController'
import type { userInfo } from '../server/api/types/auth'
export const useAuthStore = defineStore('store', () => {
  const isInitialized = ref(false)
  const isLoggedIn = ref(false)
  const userInfo = ref<userInfo>()
  async function initialize(): Promise<void> {
    if (!isInitialized.value) {
      const res = await token()
      if (res) {
        await getUser()
      } else {
        window.api.showWindow('child_window_login')
      }

      isInitialized.value = true
    }
  }
  async function getUser(): Promise<void> {
    const user = await getUserInfo()
    if (user != null) {
      userInfo.value = user.data?.data
      isLoggedIn.value = true
    }
  }
  return {
    initialize,
    isLoggedIn,
    isInitialized,
    userInfo,
    getUser
  }
})
