// @ts-nocheck
import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { useWsClient, WsMessage, WsStatus } from '@renderer/server/wsClient'
import type { UserInfo } from '../views/home/userSpace/types'
import { useAuthStore } from './index'
import localforage from 'localforage'
import { historyOlder } from '@renderer/server/api/userController'

// 配置localforage
localforage.config({
  name: 'BlibliChat',
  storeName: 'chatMessages'
})

// 定义接收消息的数据结构（来自后端）
interface ReceivedMessageData {
  id: string | number
  fromUserId: string // 消息发送者ID
  content: string // 消息内容
}

// 定义发送消息的数据结构（发送到后端）
interface SendMessageData {
  toUserId: string // 消息接收者ID
  content: string // 消息内容
}

// 定义本地消息存储结构
interface ChatMessage {
  id: string | number
  fromUserId: string // 消息发送者ID
  content: string // 消息内容
  createdAt: Date // 消息创建时间
}

export const useChatStore = defineStore('chat', () => {
  // 显示/隐藏消息侧边栏
  const showMessage = ref(false)
  // 当前选中的联系人
  const currentContact = ref<UserInfo | null>(null)
  // 消息列表
  const messages = ref<ChatMessage[]>([])
  // WebSocket 客户端
  const wsClient = useWsClient()
  // 导入authStore获取userInfo
  const authStore = useAuthStore()
  // 标志：消息处理器是否已注册
  const handlersRegistered = ref(false)

  // 计算属性：是否连接
  const isConnected = computed(() => wsClient.getStatus() === WsStatus.OPEN)

  /**
   * @description 切换消息侧边栏显示/隐藏
   */
  const toggleMessage = (): void => {
    showMessage.value = !showMessage.value
  }

  /**
   * @description 设置当前联系人
   */
  const setCurrentContact = (contact: UserInfo): void => {
    currentContact.value = contact
    showMessage.value = true
    // 加载聊天历史记录
    loadChatHistory(contact.id)
  }

  /**
   * @description 保存消息到本地存储
   */
  const saveMessageToLocal = async (message: ChatMessage): Promise<void> => {
    try {
      if (!currentContact.value) return

      // 获取当前联系人的所有消息
      const contactId = currentContact.value.id
      const key = `chat_${authStore.userInfo?.id}_${contactId}`
      const chatHistory = (await localforage.getItem<ChatMessage[]>(key)) || []

      // 添加新消息
      chatHistory.push(message)

      // 保存回本地存储
      await localforage.setItem(key, chatHistory)
      console.log('Message saved to local storage')
    } catch (error) {
      console.error('Failed to save message to local storage:', error)
    }
  }

  /**
   * @description 发送消息
   */
  const sendMessage = async (content: string): Promise<void> => {
    if (!currentContact.value) return
    if (!content.trim()) return // 避免发送空消息

    try {
      // 确保消息处理器已注册
      ensureMessageHandlers()

      // 检查并确保WebSocket连接
      if (wsClient.getStatus() !== WsStatus.OPEN) {
        await wsClient.connect()
      }

      // 发送消息：使用toUserId指定接收者
      const sendData: SendMessageData = {
        toUserId: currentContact.value.id, // 接收者ID
        content: content.trim() // 消息内容
      }

      await wsClient.send('chat', sendData)

      // 本地添加消息
      const newMessage: ChatMessage = {
        id: Date.now(),
        fromUserId: authStore.userInfo?.id || 'current-user-id', // 当前用户作为发送者
        content: content.trim(),
        createdAt: new Date()
      }

      addMessage(newMessage)
      // 保存到本地存储
      await saveMessageToLocal(newMessage)
    } catch (error) {
      console.error('Failed to send message:', error)
      // 显示用户友好的错误提示
      if (window.$message) {
        window.$message.error('发送消息失败，请检查网络连接')
      }
    }
  }

  /**
   * @description 添加消息到列表
   */
  const addMessage = (message: any): void => {
    if (!message || !message.content) return // 避免添加无效消息

    const newMessage: ChatMessage = {
      id: message.id || Date.now(),
      fromUserId: message.fromUserId || '', // 确保有发送者ID
      content: message.content,
      createdAt: message.createdAt ? new Date(message.createdAt) : new Date()
    }

    messages.value.push(newMessage)

    // 如果是当前联系人的消息，保存到本地
    if (currentContact.value && message.fromUserId === currentContact.value.id) {
      saveMessageToLocal(newMessage)
    }
  }

  /**
   * @description 加载聊天历史记录
   */
  const loadChatHistory = async (contactId: string): Promise<void> => {
    try {
      // 从本地存储加载聊天记录
      const key = `chat_${authStore.userInfo?.id}_${contactId}`
      const chatHistory = (await localforage.getItem<ChatMessage[]>(key)) || []

      // 转换日期格式（localforage会将Date转换为ISO字符串）
      const formattedMessages = chatHistory.map((msg) => ({
        ...msg,
        createdAt: new Date(msg.createdAt)
      }))

      messages.value = formattedMessages
      console.log('Chat history loaded from local storage')

      // 获取本地记录中最新的消息时间戳
      let latestTimestamp = 0
      if (formattedMessages.length > 0) {
        // 按时间戳排序，获取最新的消息
        const sortedMessages = [...formattedMessages].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
        latestTimestamp = sortedMessages[0].createdAt.getTime()
      }

      // 调用API获取最新的消息（离线期间的消息）
      const res = await historyOlder(contactId, latestTimestamp)

      if (res.data != null && res.data.data.length > 0) {
        // 处理新获取的离线消息
        res.data.data.forEach((msg) => {
          messages.value.push({
            id: msg.id,
            fromUserId: msg.fromUserId,
            content: msg.content,
            createdAt: new Date(msg.createdAt)
          })
        })
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
      messages.value = []
    }
  }

  /**
   * @description 清除聊天记录
   */
  const clearChatHistory = async (contactId: string): Promise<void> => {
    try {
      const key = `chat_${authStore.userInfo?.id}_${contactId}`
      await localforage.removeItem(key)
      if (currentContact.value && currentContact.value.id === contactId) {
        messages.value = []
      }
      console.log('Chat history cleared from local storage')
    } catch (error) {
      console.error('Failed to clear chat history:', error)
    }
  }

  /**
   * @description 确保消息处理器已注册
   */
  const ensureMessageHandlers = () => {
    if (!handlersRegistered.value) {
      // 注册消息处理器
      wsClient.on('chat', (message: WsMessage) => {
        const receivedData = message.data as ReceivedMessageData
        if (receivedData && receivedData.content) {
          addMessage({
            id: receivedData.id || Date.now(),
            fromUserId: receivedData.fromUserId,
            content: receivedData.content,
            createdAt: message.createdAt
          })
        }
      })

      handlersRegistered.value = true
    }
  }

  /**
   * @description 初始化 WebSocket 连接
   */
  const initWebSocket = async (): Promise<void> => {
    try {
      // 确保消息处理器已注册
      ensureMessageHandlers()

      // 连接WebSocket
      await wsClient.connect()
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      // 显示错误提示
      if (window.$message) {
        window.$message.error('WebSocket连接失败，请稍后重试')
      }
    }
  }

  // 在组件挂载时注册消息处理器
  onMounted(() => {
    ensureMessageHandlers()
  })

  return {
    showMessage,
    currentContact,
    messages,
    isConnected,
    toggleMessage,
    setCurrentContact,
    sendMessage,
    addMessage,
    loadChatHistory,
    clearChatHistory,
    initWebSocket
  }
})
