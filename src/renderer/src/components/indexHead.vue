<template>
  <div class="zj-header">
    <div class="zj-header_login">
      <span class="icon-bilibili iconfont"></span>
    </div>
    <transition name="fade">
      <div v-if="hide && route.name != '/home/index'" class="zj-header_entry">
        <n-tabs type="line" animated>
          <n-tab name="推荐"> </n-tab>
          <n-tab name="热门"> </n-tab>
          <n-tab name="追番"> </n-tab>
          <n-tab name="影视"> </n-tab>
        </n-tabs>
      </div>
    </transition>
    <div class="zj-header_search">
      <div
        ref="box"
        class="zj-header_search--box"
        :class="{
          'zj-header_search--box--move-to-center': isFocused,
          'zj-header_search--box--move-back': !isFocused
        }"
      >
        <n-input
          type="text"
          placeholder="搜索你感兴趣的内容"
          @focus="focuSearch"
          @blur="blurSearch"
        >
          <template #suffix>
            <span class="iconfont icon-sousuo"></span>
          </template>
        </n-input>
      </div>
    </div>
    <div class="zj-header_setgroup">
      <app-button type="hide"></app-button>
      <app-button type="shrink"></app-button>
      <app-button type="clone" @click="cloneWind"></app-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const hide = ref(true)
const isFocused = ref(false)
const box = ref<HTMLElement | null>(null)
const focuSearch = (): void => {
  searchChage()
}

const blurSearch = (): void => {
  searchChage()
}
const cloneWind = (): void => {
  window.api.cloneWindow()
}
const searchChage = (): void => {
  hide.value = !hide.value
  isFocused.value = !isFocused.value
  hide.value ? (box.value!.style.width = '300px') : (box.value!.style.width = '400px')
}
</script>

<style lang="scss" scoped>
@include b(header) {
  display: flex;
  width: 100%;
  height: 8vh;
  align-items: center;
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.1);

  @include e(login) {
    display: flex;
    width: 150px;
    justify-content: center;
    color: #ff6699;
  }

  @include e(entry) {
  }

  @include e(search) {
    flex: 1;
    display: flex;
    margin: 0 20px;
    justify-content: flex-end;

    @include m(box) {
      position: relative;
      width: 300px;
      right: 0;
      &--move-to-center {
        animation: moveToCenter 0.5s ease forwards;
      }

      &--move-back {
        animation: moveBack 0.5s ease forwards;
      }
    }
  }

  @include e(setgroup) {
    width: 150px;
    display: flex;
    justify-content: space-around;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes moveToCenter {
  from {
    right: 0;
  }
  to {
    right: calc(50% - 200px);
  }
}

@keyframes moveBack {
  from {
    right: calc(50% - 200px);
  }
  to {
    right: 0;
  }
}
</style>
