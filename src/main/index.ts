// @ts-nocheck
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { WindowService } from './wind-server'
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import Store from 'electron-store'
const schema = {
  auth: {
    type: 'object',
    properties: {
      isInitialized: { type: 'boolean', default: false },
      isLoggedIn: { type: 'boolean', default: false },
      userInfo: {
        type: ['object', 'null'],
        default: null,
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
          nickname: { type: 'string' }
        }
      }
    },
    default: {
      isInitialized: false,
      isLoggedIn: false,
      userInfo: null
    }
  }
}
interface UserInfo {
  id: string
  username: string
  nickname: string
}

interface AuthState {
  isInitialized: boolean
  isLoggedIn: boolean
  userInfo: UserInfo | null
}
const store = new Store<{ auth: AuthState }>({ schema })

// 添加存储初始化
class MainApplication {
  private static readonly MAIN_WINDOW_ID = 'main_app_window'
  private static preloadPath = join(__dirname, '../preload/index.js')

  // 初始化应用配置
  private static initialize(): void {
    // 设置 Windows 应用模型 ID
    electronApp.setAppUserModelId('com.electron.app')
    // 开发环境快捷键配置
    if (process.env.NODE_ENV === 'development') {
      app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
      })
    }
  }

  // 窗口通讯处理
  private static registerIPCHandlers(): void {
    // 健康检查
    ipcMain.handle('health-check', () => 'ok')
    // 隐藏窗口
    ipcMain.on('hide-current-window', (_, windowId) => {
      const window = WindowService.getWindowById(windowId)
      if (window) {
        window.hide()
      } else {
        console.error(`未找到窗口 ID 为 ${windowId} 的窗口`)
      }
    })
    // 显示窗口
    ipcMain.on('show-window', (_, windowId) => {
      const window = WindowService.getWindowById(windowId)
      if (window) {
        window.show()
      } else {
        console.error(`未找到窗口 ID 为 ${windowId} 的窗口`)
      }
    })

    ipcMain.on('open-video-window', (_, videoId) => {
      const window = WindowService.getWindowById('child_window_video')
      if (window) {
        window.webContents.send('receive-video-id', videoId)
        window.show()
      }
    })
    // 安全打开外部链接
    ipcMain.handle('safe-open-external', (_, url) => {
      if (typeof url === 'string' && /^https?:\/\//.test(url)) {
        shell.openExternal(url)
        return true
      }
      return false
    })
    //store操作
    ipcMain.handle('getKeyState', (_, key: string) => {
      return store.get(key)
    })
    ipcMain.handle('setKeyState', (_, key: string, state: Partial<AuthState>) => {
      store.set('auth', { ...store.get(key), ...state })
    })
    ipcMain.on('pinia-state-changed', (event, { storeId, state }) => {
      const sender = event.sender
      BrowserWindow.getAllWindows().forEach((win) => {
        if (win.webContents.id !== sender.id) {
          win.webContents.send('pinia-state-update', { storeId, state })
        }
      })
    })
  }

  // 创建应用主窗口
  private static createApplicationWindow(): void {
    // 主窗口配置
    WindowService.createMainWindow({
      windowId: this.MAIN_WINDOW_ID,
      width: 1200,
      height: 776,
      route: '/',
      minWidth: 1100,
      minHeight: 680,
      show: false,
      title: 'Electron 应用',
      autoHideMenuBar: true,
      icon,
      webPreferences: {
        preload: this.preloadPath,
        devTools: process.env.NODE_ENV === 'development',
        sandbox: false,
        contextIsolation: true
      }
    }).on('closed', () => {
      WindowService.closeAllWindows()
    })
  }

  // 创建子窗口
  private static createChildWindow(): void {
    // 登录窗口配置
    const login = {
      width: 820,
      height: 450,
      route: '/login',
      isMainWindow: false,
      allowMultiple: false,
      frame: false,
      windowId: 'child_window_login',
      show: false,
      resizable: false,
      webPreferences: {
        preload: this.preloadPath,
        devTools: process.env.NODE_ENV === 'development',
        sandbox: false,
        contextIsolation: true
      }
    }
    const video = {
      width: 1120,
      height: 660,
      minWidth: 1120,
      minHeight: 660,
      route: '/video',
      autoHideMenuBar: true,
      isMainWindow: false,
      windowId: 'child_window_video',
      show: false,
      webPreferences: {
        preload: this.preloadPath,
        devTools: process.env.NODE_ENV === 'development',
        sandbox: false,
        contextIsolation: true
      }
    }

    WindowService.createChildWindowAll([
      { options: login, show: false },
      { options: video, show: false }
    ])
  }

  // 生命周期管理
  private static manageLifecycle(): void {
    app.on('activate', () => {
      if (WindowService.getAllWindows().length === 0) {
        this.createApplicationWindow()
      }
    })

    // 全局窗口关闭处理
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }

  // 启动应用
  public static bootstrap(): void {
    app.whenReady().then(() => {
      this.initialize()
      this.registerIPCHandlers()
      this.createApplicationWindow()
      this.createChildWindow()
      this.manageLifecycle()
    })

    // 安全警告
    app.on('web-contents-created', (_, contents) => {
      contents.on('will-attach-webview', (event) => {
        event.preventDefault() // 禁止任意 webview 加载
      })
    })
  }
}

// 启动应用
MainApplication.bootstrap()
