<template>
  <transition name="slide">
    <div v-if="show" class="zj-message-sidebar">
      <!-- 头部 -->
      <div class="zj-message-sidebar_header">
        <button class="back-btn iconfont icon-fanhui" @click="handleClose"></button>
        <span class="chat-title">{{ chatStore.currentContact?.nickName || '聊天' }}</span>
        <button class="more-btn iconfont icon-more"></button>
      </div>

      <!-- 内容区 -->
      <div class="zj-message-sidebar_content">
        <template v-for="message in messages" :key="message.id">
          <!-- 消息项 -->
          <div
            class="message-item"
            :class="{
              other: message.fromUserId !== currentUserId,
              self: message.fromUserId === currentUserId
            }"
          >
            <n-avatar
              class="avatar"
              round
              :size="36"
              :src="`/api/user/getAvatara?path=${message.fromUserId}`"
              :fallback-src="defaultImage"
            />
            <div class="message-bubble">
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>
        </template>

        <div class="no-more">没有更多消息了~</div>
      </div>

      <!-- 底部输入区 -->
      <div class="zj-message-sidebar_footer">
        <div class="footer-input">
          <input
            v-model="messageInput"
            type="text"
            class="message-input"
            placeholder="发个消息聊聊呗~"
            @keyup.enter="handleSendMessage"
          />
          <button v-show="messageInput" @click="handleSendMessage">发送</button>
        </div>
        <div class="footer-icons">
          <button class="iconfont icon-tupian"></button>
          <button class="iconfont icon-biaoqing"></button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts" setup>
import defaultImage from '@renderer/assets/images/default.png'
import { ref, computed } from 'vue'
import { useChatStore } from '@store/chat'
import { useAuthStore } from '@store'

const chatStore = useChatStore()
const authStore = useAuthStore()

// 计算属性
const show = computed(() => chatStore.showMessage)
const contact = computed(() => chatStore.currentContact)
const messages = computed(() => chatStore.messages)
const currentUserId = computed(() => authStore.userInfo?.id || 'unknown')

const emit = defineEmits<{
  (e: 'close'): void
}>()

const messageInput = ref()

const handleClose = (): void => {
  chatStore.toggleMessage()
  emit('close')
}

// 发送消息的方法
const handleSendMessage = (): void => {
  const content = messageInput.value.trim()
  if (!content) return
  chatStore.sendMessage(content)
  messageInput.value = ''
}
</script>

<style lang="scss" scoped>
@include b(message-sidebar) {
  position: absolute;
  left: 70px;
  top: 0;
  width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  z-index: 2;
  /* ===== header ===== */
  @include e(header) {
    height: 48px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-bottom: 1px solid #eee;

    .back-btn {
      font-size: 18px;
      color: #333;
      cursor: pointer;
    }

    .chat-title {
      flex: 1;
      margin-left: 10px;
      font-size: 15px;
      font-weight: 500;
      color: #333;
    }

    .more-btn {
      font-size: 18px;
      color: #999;
      cursor: pointer;
    }
  }

  /* ===== content ===== */
  @include e(content) {
    flex: 1;
    padding: 10px 12px;
    overflow-y: auto;
    /* 让内容从底部开始 */
    display: flex;
    flex-direction: column;

    .no-more {
      text-align: center;
      font-size: 12px;
      color: #aaa;
      margin: 8px 0 12px;
    }

    .time-divider {
      text-align: center;
      font-size: 12px;
      color: #999;
      margin: 12px 0;
    }

    .message-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 12px;

      /* 对方消息 (默认样式) */
      &.other {
        justify-content: flex-start;
        .message-bubble {
          background-color: #fff;
          border-radius: 4px 10px 10px 10px;
        }
      }

      &.self {
        flex-direction: row-reverse;
        justify-content: flex-start;
        gap: 8px;

        .message-bubble {
          background-color: #ff6699;
          border-radius: 10px 4px 10px 10px;
          .message-content {
            color: #fff;
          }
        }
      }

      .avatar {
        width: 36px;
        height: 36px;
        flex-shrink: 0;
      }

      .message-bubble {
        max-width: 230px;
        padding: 8px 10px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

        .message-content {
          font-size: 13px;
          line-height: 1.5;
          color: #333;
          word-break: break-word;
        }
      }
    }
  }

  /* ===== footer ===== */
  @include e(footer) {
    height: 50px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #fff;
    border-top: 1px solid #eee;

    .footer-input {
      position: relative;
      flex: 1;

      .message-input {
        width: 100%;
        height: 35px;
        padding: 0 12px;
        border: 1px solid #eee;
        border-radius: 5px;
        font-size: 13px;
        outline: none;

        &::placeholder {
          color: #ccc;
        }

        &:focus {
          border-color: #ff6699;
        }
      }

      button {
        position: absolute;
        padding: 4px;
        width: 50px;
        right: 5px;
        top: 50%;
        font-size: 14px;
        color: white;
        border: 0;
        border-radius: 5px;
        transform: translateY(-50%);
        background-color: #ff6699;
        cursor: pointer;
      }
    }

    .footer-icons {
      display: flex;
      gap: 10px;

      button {
        font-size: 20px;
        color: #999;
        cursor: pointer;
      }
    }
  }
}

/* ===== 动画 ===== */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
