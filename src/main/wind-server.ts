import { BrowserWindow, BrowserWindowConstructorOptions, shell } from 'electron'
import path, { join } from 'path'

// 窗口配置接口
export interface WindowOptions extends BrowserWindowConstructorOptions {
  /**
   * 路由路径 (hash路由)
   * 例如: '/dashboard' 或 'settings'
   */
  route?: string

  /**
   * 是否主窗口 (应用生命周期相关)
   */
  isMainWindow?: boolean

  /**
   * 允许创建多个实例
   */
  allowMultiple?: boolean

  /**
   * 自定义窗口ID (用于后续查找)
   */
  windowId?: string
}

export class WindowService {
  // 主窗口引用
  private static mainWindow: BrowserWindow | null = null
  // 预加载脚本路径

  // 所有窗口集合
  private static windows: Map<string, BrowserWindow> = new Map()

  // 默认窗口配置
  private static defaultOptions: BrowserWindowConstructorOptions = {
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    titleBarStyle: 'hiddenInset', // macOS 标题栏样式
    trafficLightPosition: { x: 15, y: 13 }, // macOS 交通灯位置
    backgroundColor: '#fff',
    title: '我的Electron应用'
  }

  /**
   * 创建主应用窗口
   */
  public static createMainWindow(options?: WindowOptions): BrowserWindow {
    // 如果已有主窗口则返回现有实例
    if (this.mainWindow && !options?.allowMultiple) {
      this.focusWindow(this.mainWindow)
      return this.mainWindow
    }

    // 合并配置
    const windowOptions: WindowOptions = {
      ...this.defaultOptions,
      ...options,
      isMainWindow: true
    }

    const window = new BrowserWindow(windowOptions)
    this.mainWindow = window

    // 分配窗口ID
    const windowId = options?.windowId || 'main_' + Date.now()
    this.windows.set(windowId, window)

    // 加载页面
    this.loadWindowContent(window, windowOptions)

    // 窗口事件处理
    this.setupWindowEvents(window, windowId, true)

    return window
  }

  /**
   * 创建子窗口
   */
  public static createChildWindow(options: WindowOptions, show: boolean): BrowserWindow {
    // 如果没有指定父窗口，默认使用主窗口作为父窗口
    // if (!options.parent && this.mainWindow) {
    //   options.parent = this.mainWindow
    // }

    // 合并配置
    const windowOptions: WindowOptions = {
      ...this.defaultOptions,
      width: 800,
      height: 600,
      ...options,
      isMainWindow: false
    }

    // 检查是否允许重复创建
    if (!options.allowMultiple && options.windowId) {
      const existingWindow = this.windows.get(options.windowId)
      if (existingWindow) {
        this.focusWindow(existingWindow)
        return existingWindow
      }
    }

    const window = new BrowserWindow(windowOptions)

    // 分配窗口ID
    const windowId = options.windowId || 'child_' + Date.now()
    this.windows.set(windowId, window)

    // 加载页面
    this.loadWindowContent(window, windowOptions)

    // 窗口事件处理
    this.setupWindowEvents(window, windowId, show)

    return window
  }
  public static createChildWindowAll(
    optionsArray: { options: WindowOptions; show: boolean }[]
  ): void {
    for (const { options, show } of optionsArray) {
      this.createChildWindow(options, show)
    }
  }
  /**
   * 加载窗口内容
   */
  private static loadWindowContent(window: BrowserWindow, options: WindowOptions): void {
    const indexPath = path.join(__dirname, '../renderer/index.html')

    // 开发模式使用Vite开发服务器
    if (process.env.NODE_ENV === 'development') {
      window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}${options.route || ''}`)
    }
    // 生产模式使用文件加载
    else {
      window.loadFile(indexPath, options.route ? { hash: options.route } : undefined)
    }
  }

  /**
   * 设置窗口事件
   */
  private static setupWindowEvents(window: BrowserWindow, windowId: string, show: boolean): void {
    window.on('ready-to-show', () => {
      show && window.show()
    })

    // 外部链接用默认浏览器打开
    window.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('http:') || url.startsWith('https:')) {
        shell.openExternal(url)
      }
      return { action: 'deny' }
    })

    // 窗口关闭事件
    window.on('closed', () => {
      if (window === this.mainWindow) {
        this.mainWindow = null
      }
      this.windows.delete(windowId)
    })

    // 窗口聚焦事件
    window.on('focus', () => {
      window.webContents.send('window-focus', { focused: true })
    })

    window.on('blur', () => {
      window.webContents.send('window-focus', { focused: false })
    })
  }
  /**
   * 激活/聚焦窗口
   */
  private static focusWindow(window: BrowserWindow): void {
    if (window.isMinimized()) window.restore()
    window.focus()
  }

  /**
   * 获取所有窗口
   */
  public static getAllWindows(): BrowserWindow[] {
    return Array.from(this.windows.values())
  }

  /**
   * 获取主窗口
   */
  public static getMainWindow(): BrowserWindow | null {
    return this.mainWindow
  }

  /**
   * 通过ID获取窗口
   */
  public static getWindowById(id: string): BrowserWindow | undefined {
    return this.windows.get(id)
  }

  /**
   * 关闭所有窗口
   */
  public static closeAllWindows(): void {
    this.windows.forEach((window) => {
      if (!window.isDestroyed()) {
        window.close()
      }
    })
    this.windows.clear()
    this.mainWindow = null
  }
}
