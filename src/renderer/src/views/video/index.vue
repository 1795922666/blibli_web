<template>
  <div class="zj-video">
    <video-head @clone="cloneWin"></video-head>
    <div class="zj-video_content">
      <div ref="art" class="zj-video_content--play"></div>
      <right-column :video-info="videoStore.newVideo" :show-hide="showHide"></right-column>
    </div>
  </div>
</template>

<script lang="ts" setup>
import videoHead from './components/videoHead.vue'
import rightColumn from './components/rightColumn.vue'
import { useVideoStore } from '@store/video'
import { getVideo } from '@api'
import Artplayer from 'artplayer'

import Hls from 'hls.js'
import { onMounted, ref } from 'vue'
const videoStore = useVideoStore()
const art = ref()
const instance = ref()
const showHide = ref(true)
const playM3u8 = (video, url, art): void => {
  if (Hls.isSupported()) {
    if (art.hls) art.hls.destroy()
    const hls = new Hls()
    hls.loadSource(url)
    hls.attachMedia(video)
    art.hls = hls
    art.on('destroy', () => hls.destroy())
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url
  } else {
    art.notice.show = 'Unsupported playback format: m3u8'
  }
}
window.api.onReceiveVideoId(async (_, videoId: string) => {
  const {
    data: { data }
  } = await getVideo(videoId)
  if (data) {
    videoStore.setNewVideo(data)
    instance.value.url = `/api/video/${data.fileUrl}/index.m3u8`
  }
})
const cloneWin = (): void => {
  instance.value.pause()
}
const createArtplayer = (): void => {
  instance.value = new Artplayer({
    container: art.value,
    url: `/api/video/index.m3u8`,
    type: 'm3u8',
    volume: 0.5, // 默认音量
    autoplay: true,
    muted: false,
    loop: false,
    setting: true,
    flip: true, // 支持画面翻转
    playbackRate: true, // 支持播放速度调整
    aspectRatio: true, // 支持画面比例调整
    fullscreen: true, // 启用全屏
    fullscreenWeb: true, // 网页全屏
    miniProgressBar: true, // 迷你进度条
    mutex: true, // 互斥模式（同时只允许一个播放器播放）
    playsInline: true, // 内联播放（移动端）
    airplay: true, // 支持 AirPlay
    theme: '#ff6699',
    moreVideoAttr: {
      crossOrigin: 'anonymous',
      playsInline: true
    },
    customType: {
      m3u8: playM3u8
    },
    plugins: [
      // 插件
    ]
  })
}
onMounted(() => {
  createArtplayer()
})
</script>

<style lang="scss" scoped>
@include b(video) {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  @include e(content) {
    flex: 1;
    overflow: hidden;
    display: flex;
    @include m(play) {
      flex: 1;
    }
  }
}
</style>
