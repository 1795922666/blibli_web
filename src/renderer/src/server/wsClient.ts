import { ref } from 'vue'

// WebSocket 消息类型定义
export interface WsMessage {
  type: string
  data: any
  createdAt: number
}

// WebSocket 状态类型
export enum WsStatus {
  CONNECTING = 'CONNECTING',
  OPEN = 'OPEN',
  CLOSING = 'CLOSING',
  CLOSED = 'CLOSED'
}

// 定义WebSocketClient接口，明确公开方法
export interface IWebSocketClient {
  connect(): Promise<void>
  disconnect(): void
  send(type: string, data: any): Promise<void>
  on(type: string, handler: (message: WsMessage) => void): () => void
  getStatus(): WsStatus
}

class WebSocketClient implements IWebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private protocols?: string | string[]
  private messageHandlers = new Map<string, Set<(message: WsMessage) => void>>()
  private status = ref(WsStatus.CLOSED)

  constructor(url: string, protocols?: string | string[]) {
    this.url = url
    this.protocols = protocols
  }

  // 连接 WebSocket
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.ws) {
          this.ws.close()
          this.ws = null
        }

        this.ws = new WebSocket(this.url, this.protocols)
        this.status.value = WsStatus.CONNECTING

        // 连接打开事件
        this.ws.onopen = () => {
          console.log('WebSocket connection opened')
          this.status.value = WsStatus.OPEN
          resolve()
        }

        // 消息接收事件
        this.ws.onmessage = (event) => {
          this.handleMessage(event)
        }

        // 连接关闭事件
        this.ws.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason)
          this.status.value = WsStatus.CLOSED
          this.ws = null
        }

        // 连接错误事件
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.status.value = WsStatus.CLOSED
          reject(error)
        }
      } catch (error) {
        console.error('Failed to create WebSocket:', error)
        reject(error)
      }
    })
  }

  // 断开连接
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'User initiated disconnect')
      this.ws = null
    }
  }

  // 发送消息
  send(type: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.status.value !== WsStatus.OPEN) {
        reject(new Error('WebSocket not connected'))
        return
      }

      const message: WsMessage = {
        type,
        data,
        createdAt: Date.now()
      }

      try {
        this.ws.send(JSON.stringify(message))
        resolve()
      } catch (error) {
        console.error('Failed to send message:', error)
        reject(error)
      }
    })
  }

  // 注册消息处理器
  on(type: string, handler: (message: WsMessage) => void): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set())
    }
    const handlers = this.messageHandlers.get(type)!
    handlers.add(handler)

    // 返回取消订阅函数
    return () => {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.messageHandlers.delete(type)
      }
    }
  }

  // 处理接收到的消息
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WsMessage = JSON.parse(event.data)
      console.log('Received WebSocket message:', event)
      // 调用注册的消息处理器
      const handlers = this.messageHandlers.get(message.type) || this.messageHandlers.get('*')
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(message)
          } catch (error) {
            console.error('Error in message handler:', error)
          }
        })
      } else {
        console.warn(`No handlers registered for message type: ${message.type}`)
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
      console.error('Raw message:', event.data)
    }
  }

  // 获取当前状态
  getStatus(): WsStatus {
    return this.status.value
  }
}

// 单例实例
let wsClientInstance: IWebSocketClient | null = null

// 创建 WebSocket 实例并导出
export const useWsClient = (): IWebSocketClient => {
  if (!wsClientInstance) {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:4000/api/chat' // 与环境变量保持一致
    wsClientInstance = new WebSocketClient(wsUrl)
  }
  return wsClientInstance
}
