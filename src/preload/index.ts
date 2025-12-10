import { contextBridge, ipcRenderer } from 'electron'
import { ElectronAPI, electronAPI } from '@electron-toolkit/preload'

/**
 * 安全暴露的 Electron API 类型定义
 */
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      openExternal: (url: string) => Promise<boolean>
      getAppHealth: () => Promise<string>
      onWindowFocusChange: (callback: (isFocused: boolean) => void) => () => void
      cloneWindow: () => void
    }
  }
}
const api = {
  openExternal: (url: string) => {
    if (!url.startsWith('http')) {
      return Promise.reject(new Error('仅支持 http/https 协议'))
    }
    return ipcRenderer.invoke('safe-open-external', url)
  },

  cloneWindow: (windowId: string) => ipcRenderer.send('hide-current-window', windowId),

  showWindow: (windowId: string) => ipcRenderer.send('show-window', windowId),

  openVideoWindow: (videoId: string) => {
    ipcRenderer.send('open-video-window', videoId)
  },

  onReceiveVideoId: (callback) => ipcRenderer.on('receive-video-id', callback),

  getAppHealth: () => ipcRenderer.invoke('health-check'),

  store: {
    get: (key: string) => ipcRenderer.invoke('getAuthState', key),
    set: (key: string, value) => ipcRenderer.invoke('setAuthState', key, value),
    onStoreUpdate: (callback: (payload: { storeId: string; state }) => void) => {
      const listener = (_: unknown, payload: { storeId: string; state }) => callback(payload)
      ipcRenderer.on('pinia-state-update', listener)
      return () => ipcRenderer.removeListener('pinia-state-update', listener)
    },
    sendStoreUpdate: (storeId: string, state) => {
      ipcRenderer.send('pinia-state-changed', { storeId, state })
    }
  }
}

// 安全暴露 API
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('ContextBridge 暴露失败:', error)
  }
} else {
  // 非安全环境下的降级处理
  console.warn('⚠️ 上下文隔离未启用！')
  window.electron = electronAPI
  window.api = api
}
