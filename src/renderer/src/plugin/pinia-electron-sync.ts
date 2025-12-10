// src/plugins/pinia-electron-sync.ts
import type { PiniaPluginContext } from 'pinia'

export function piniaElectronSync({ store }: PiniaPluginContext): (() => void) | void {
  // 1. 安全检测 Electron API
  if (!window.api?.store) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[PiniaSync] Electron store API 未就绪')
    }
    return
  }

  const electronAPI = window.api.store
  let isExternalUpdate = false
  let lastStateJson = ''

  const removeListener = electronAPI.onStoreUpdate?.(({ storeId, state }) => {
    if (storeId !== store.$id) return
    isExternalUpdate = true
    console.log('electron 状态更新', storeId)

    try {
      const newStateJson = JSON.stringify(state)
      if (newStateJson !== lastStateJson) {
        store.$patch(state)
        lastStateJson = newStateJson
      }
    } finally {
      setTimeout(() => (isExternalUpdate = false), 10)
    }
  })

  const unsubscribe = store.$subscribe((_, state) => {
    if (!isExternalUpdate) {
      try {
        const serializedState = JSON.parse(JSON.stringify(state))
        const currentJson = JSON.stringify(serializedState)

        if (currentJson !== lastStateJson) {
          electronAPI.sendStoreUpdate?.(store.$id, serializedState)
          lastStateJson = currentJson
        }
      } catch (err) {
        console.error('[PiniaSync] 状态序列化失败:', err)
      }
    }
  })

  return () => {
    removeListener?.()
    unsubscribe()
  }
}
