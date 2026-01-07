<template>
  <div class="zj-sidebar">
    <div class="zj-sidebar_top">
      <div
        v-for="(item, index) in sidebar"
        :key="index"
        :class="{ active: newRoute === item.path }"
        class="zj-sidebar_top--button"
        @click="handleClick(item.path)"
      >
        <div :class="item.icon"></div>
        <div class="zj-sidebar_top--button_text">{{ item.text }}</div>
      </div>
    </div>
    <div class="zj-sidebar_bottom">
      <div class="zj-sidebar_bottom--box">
        <n-avatar
          class="btn"
          round
          :size="25"
          :src="`/api/user/getAvatara?path=${user.userInfo?.id}`"
          :fallback-src="defaultImage"
          @click="getUserSpace"
        >
        </n-avatar>
        <router-link to="/home/postfile" class="iconfont icon-shangchuan"></router-link>
        <button
          class="iconfont icon-xinxi"
          style="border: 0"
          @click="toggleMessageSidebar"
        ></button>
        <router-link to="/home/postfile" class="iconfont icon-shezhi"></router-link>
      </div>
    </div>
    <!-- 消息侧边栏组件 -->
  </div>
  <message-sidebar
    :contact="{ id: 11111, name: '用户1', avatar: '/api/user/getAvatara?path=11111' }"
    :show="chatStore.showMessage"
    @close="toggleMessageSidebar"
  />
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@store'
import { useChatStore } from '@store/chat'
import defaultImage from '@renderer/assets/images/default.png'
const authStore = useAuthStore()
const chatStore = useChatStore()
const user = authStore
const router = useRouter()
const route = useRoute()

const toggleMessageSidebar = (): void => {
  chatStore.toggleMessage()
}

const getUserSpace = (): void => {
  router.push(`/home/${user.userInfo?.id}/userspace`)
}
const newRoute = computed(() => route.path)

const sidebar = reactive({
  home: {
    path: '/home/index',
    icon: 'iconfont icon-shouye1',
    text: '首页'
  },
  choiceness: {
    path: '/home/choiceness',
    icon: 'iconfont icon-jingxuan1',
    text: '精选'
  },
  dynamicState: {
    path: '/home/dynamicState',
    icon: 'iconfont icon-fengche',
    text: '动态'
  },
  my: {
    path: '/home/my',
    icon: 'iconfont icon-a_blibli-copy',
    text: '我的'
  }
})
const handleClick = (path: string): void => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.active {
  color: #ff6699;
}
@include b(sidebar) {
  position: relative;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 70px;
  height: 100%;
  background-color: #f6f7f8;
  @include e(top) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 250px;
    margin: 20px 0;

    @include m(button) {
      cursor: pointer;
      text-align: center;
      line-height: 22px;

      &:hover {
        color: #ff6699;
      }

      & .iconfont {
        font-size: 25px;
        font-weight: 600;
      }

      @include e(text) {
        font-size: 12px;
      }
    }
  }

  @include e(bottom) {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    @include m(box) {
      display: flex;
      height: 180px;
      flex-direction: column;
      justify-content: space-around;
      line-height: 20px;
      margin-bottom: 20px;

      & .iconfont {
        font-size: 25px;
        cursor: pointer;
        text-align: center;
      }

      & div:hover,
      & .iconfont:hover {
        color: #ff6699;
      }
    }
  }
}
</style>
