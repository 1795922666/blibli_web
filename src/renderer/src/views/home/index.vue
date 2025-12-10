<template>
  <n-infinite-scroll style="height: 100%" :distance="20" @load="handleLoad">
    <div class="green">
      <div class="zj-video">
        <n-grid cols="2 s:3 m:4 l:5 xl:5 2xl:5" :x-gap="20" responsive="screen">
          <n-grid-item v-for="(item, index) in videoInfo" :key="index">
            <videos-card :video-info="item" :loading="false"></videos-card>
          </n-grid-item>
          <n-grid-item v-for="(item, index) in loadArray" v-show="!loading" :key="index">
            <videos-card :video-info="item" :loading="true"></videos-card>
          </n-grid-item>
        </n-grid>
      </div>
    </div>
  </n-infinite-scroll>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { recommend } from '@api'
const loading = ref(false)

interface VideoInfo {
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
const loadArray = Array.from({ length: 20 }).map(() => ({
  id: '',
  userId: '',
  userName: '',
  title: '',
  publiceTime: '',
  cover: '',
  viewCount: 0,
  danmakuCount: 0,
  duration: ''
}))
const videoInfo = ref<VideoInfo[]>([])
const handleLoad = (): void => {
  if (loading.value) return
  loading.value = true
  setTimeout(() => {
    Array.from({ length: 20 }).forEach(() => {
      videoInfo.value.push({
        videoId: ' ',
        userId: ' ',
        nickName: ' ',
        title: ' ',
        publishTime: '',
        coverUrl: ' ',
        viewCount: 0,
        danmakuCount: 0,
        duration: '00:00:00'
      })
    })
    loading.value = false
  }, 2000)
}

const getRecommend = async (): Promise<void> => {
  loading.value = true
  const {
    data: { data }
  } = await recommend()
  if (data) {
    videoInfo.value = data
  }
}

onMounted(async () => {
  getRecommend()
})
</script>

<style lang="scss" scoped>
.zj-video {
  max-width: 1700px;
  flex: 1;
}

.green {
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 10px 30px;
}
</style>
