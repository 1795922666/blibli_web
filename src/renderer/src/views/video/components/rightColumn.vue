<template>
  <insert-coins ref="coins" @insert="inserted"></insert-coins>
  <div :style="{ width: show ? '380px' : '0' }" class="zj-rightcolumn">
    <n-tabs
      style="height: 100%"
      :pane-style="{ height: '100%', overflow: 'hidden' }"
      :tabs-padding="15"
      :bar-width="15"
      @update:value="change"
    >
      <n-tab-pane name="brief">
        <template #tab>
          <span :class="{ tab: true, tabactive: activeName == 'brief' }">简介</span>
        </template>
        <brief
          :video-info="videoInfo"
          @like="liked"
          @collect="collected"
          @insert="coinModal"
        ></brief>
      </n-tab-pane>

      <n-tab-pane name="comment">
        <template #tab>
          <!-- <n-badge
            color="grey"
            style="--n-font-size: 10px"
            show-zero
            :value="videoInfo.danmakuCount"
            :offset="[20, 12]"
          > -->
          <span :class="{ tab: true, tabactive: activeName == 'comment' }">评论</span>
          <!-- </n-badge> -->
        </template>
        <comment :video-id="videoInfo.videoId"></comment>
      </n-tab-pane>
    </n-tabs>
    <div v-show="showHide" class="zj-rightcolumn_hide" @click="hide">
      <span :class="['iconfont', show ? 'icon-right' : 'icon-left']"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import comment from './comment.vue'
import brief from './brief.vue'
import insertCoins from './insertCoins.vue'
import { giveLike, collcetVideo, getMaxCoin, giveCoin } from '@api'
import { useVideoStore } from '@store/video'
const videoStore = useVideoStore()
interface Props {
  showHide: boolean
  videoInfo: {
    userInfo: {
      id: string
      nickName: string
      avatar: string
      signature: string
      followed: boolean
      self: boolean
    }
    videoId: string //视频id
    title: string //视频标题
    description: string //视频简介
    fileUrl: string //视频文件地址
    likeCount: number //视频点赞数
    collectCount: number //视频收藏数
    coinCount: number //视频投币数
    danmakuCount: number //弹幕数
    viewCount: number //视频播放量
    publishTime: string //视频发布时间
    videoStatus: {
      liked: boolean //是否点赞
      collect: boolean //是否收藏
      insert: boolean //是否投币
    }
  }
}
const props = defineProps<Props>()
const activeName = ref('brief')
const coins = ref() // 投币弹窗
const show = ref(true)
const change = (value: string): void => {
  activeName.value = value
}
// 点赞
const liked = async (): Promise<void> => {
  const res = await giveLike(props.videoInfo.videoId)
  if (res) {
    const status = !props.videoInfo.videoStatus.liked
    videoStore.setVideoStatus('liked', status)
    videoStore.setVideoCount('likeCount', status ? 1 : -1)
  }
}
// 收藏
const collected = async (): Promise<void> => {
  const res = await collcetVideo(props.videoInfo.videoId)
  if (res) {
    const status = !props.videoInfo.videoStatus.collect
    videoStore.setVideoStatus('collect', status)
    videoStore.setVideoCount('collectCount', status ? 1 : -1)
  }
}
// 投币窗弹出
const coinModal = async (): Promise<void> => {
  const {
    data: { data }
  } = await getMaxCoin(props.videoInfo.videoId)
  if (data?.maxCoin > 0) {
    coins.value.show = true
    coins.value.maxcoin = data.maxCoin
    coins.value.coinCount = data.coinCount
  }
}
const inserted = async (num: number): Promise<void> => {
  const res = await giveCoin(props.videoInfo.videoId, num)
  if (res) {
    coins.value.show = false
    videoStore.setVideoCount('coinCount', num)
    videoStore.setVideoStatus('insert', true)
  }
}
const hide = (): void => {
  show.value = !show.value
}
</script>

<style lang="scss" scoped>
@include b(rightcolumn) {
  position: relative;
  width: 380px;
  background-color: #17181a;
  @include e(hide) {
    position: absolute;
    z-index: 100;
    left: -30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    top: calc(50% - 25px);
    width: 30px;
    height: 50px;
    border-radius: 5px 0 0 5px;
    background-color: rgba($color: #000000, $alpha: 0.2);
    &:hover {
      background-color: rgba($color: #000000, $alpha: 0.8);
    }
  }
}
.tab {
  font-size: 16px;
  font-weight: 300;
  color: #9fa4ab;
  &:hover {
    color: #d44e7d;
  }
}
.tabactive {
  font-size: 16px;
  font-weight: 400;
  color: #d44e7d;
}
.thing {
  color: #ffff;
}
</style>
