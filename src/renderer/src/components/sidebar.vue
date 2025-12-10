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
          :src="`/api/user/getAvatara?path=${user.userInfo?.avatar}`"
          :fallback-src="defaultImage"
          @click="getUserSpace"
        >
        </n-avatar>
        <router-link to="/home/postfile" class="iconfont icon-shangchuan"></router-link>
        <router-link to="/home/postfile" class="iconfont icon-xinxi"></router-link>
        <router-link to="/home/postfile" class="iconfont icon-shezhi"></router-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@store'
import defaultImage from '@renderer/assets/images/default.png'
const authStore = useAuthStore()
const user = authStore
const router = useRouter()
const route = useRoute()
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
      }
      & div:hover {
        color: #ff6699;
      }
    }
  }
}
</style>
