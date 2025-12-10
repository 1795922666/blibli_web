<template>
  <div class="zj-video-card">
    <n-skeleton v-if="loading" style="height: 65%" />
    <videos-cover v-else :video-info="videoInfo" @click="opvideo"></videos-cover>
    <div class="display">
      <template v-if="loading">
        <n-skeleton text :repeat="2" />
        <n-skeleton text style="width: 60%" />
      </template>
      <template v-else>
        <div class="zj-video-card_title" @click="opvideo">{{ videoInfo?.title }}</div>
        <router-link :to="`${videoInfo?.userId}/userspace`" class="zj-video-card_info">
          <span class="iconfont icon-up zj-video-card_info--user fonst">{{
            videoInfo?.nickName
          }}</span>
          <span class="zj-video-card_info--time fonst">{{
            formatDate(videoInfo?.publishTime)
          }}</span>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { formatDate } from '@renderer/utils/dateUtils'
interface Props {
  loading: boolean
  videoInfo: {
    videoId: string
    userId: string
    nickName: string
    title: string
    publishTime: string
    coverUrl: string
    viewCount: number
    danmakuCount: number
    duration: string
  }
}
const props = defineProps<Props>()
const opvideo = (): void => {
  window.api.openVideoWindow(props.videoInfo?.videoId)
}
</script>

<style lang="scss" scoped>
@include b(video-card) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 20px;
  aspect-ratio: 35/29;
  @include e(title) {
    height: 44px;
    padding-right: 22px;
    letter-spacing: 1px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-weight: 500;
    color: #333333;
    cursor: pointer;
    &:hover {
      color: #ff6699;
    }
  }
  @include e(info) {
    display: flex;
    @include m(user) {
      letter-spacing: 2px;
    }
  }
}
.fonst {
  margin-right: 5px;
  font-size: 13px;
}
</style>
