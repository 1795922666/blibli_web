<template>
  <div class="zj-video-cover">
    <div class="zj-video-cover_info">
      <div style="display: flex">
        <div class="iconfont icon-play">{{ videoInfo.viewCount }}</div>
        <div class="iconfont icon-danmaku">{{ videoInfo.danmakuCount }}</div>
      </div>
      <div class="duration">{{ formatSecondsToTime(videoInfo.duration) }}</div>
    </div>
    <n-image
      object-fit="cover"
      :src="`/api/video/cover?name=${videoInfo.coverUrl}`"
      preview-disabled
      class="image"
      width="100%"
    >
      <template #error>
        <img src="../assets/images/cover.png" />
      </template>
    </n-image>
  </div>
</template>

<script setup lang="ts">
import { formatSecondsToTime } from '@renderer/utils/dateUtils'
interface Props {
  videoInfo: {
    coverUrl: string
    viewCount: number
    danmakuCount: number
    duration: number
  }
}
defineProps<Props>()
</script>
<style lang="scss" scoped>
.image {
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 10px;
  transition: all 0.3s;
}
.image:hover {
  cursor: pointer;
  transform: scale(1.05);
}
img {
  width: 100%;
}
@include b(video-cover) {
  position: relative;
  color: #ffffff;
  @include e(info) {
    position: absolute;
    display: flex;
    justify-content: space-between;
    bottom: 5px;
    left: 0;
    right: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      /* 顶部完全透明 */ rgba(0, 0, 0, 1) 100% /* 底部完全黑色 */
    );
    .duration {
      margin-right: 10px;
    }
    .iconfont {
      margin-left: 10px;
      letter-spacing: 2px;
      font-size: 14px;
    }
  }
}
</style>
