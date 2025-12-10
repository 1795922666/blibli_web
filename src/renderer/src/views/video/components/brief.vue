<template>
  <div class="zj-brief">
    <personal-info
      :name-style="{ fontSize: '14px' }"
      button-type="video"
      :size="40"
      :user-info="videoInfo?.userInfo"
    ></personal-info>
    <div class="zj-brief_info">
      <div class="zj-brief_info--title">{{ videoInfo?.title }}</div>
      <div class="zj-brief_info--info-panel">
        <div class="iconfont icon-play">{{ videoInfo?.viewCount }}</div>
        <div class="iconfont icon-danmaku">{{ videoInfo?.danmakuCount }}</div>
        <div class="iconfont icon-time">{{ videoInfo?.publishTime }}</div>
      </div>
    </div>
    <div class="zj-brief_button-panel">
      <div
        :class="`zj-brief_button-panel--btn ${videoInfo?.videoStatus.liked && 'active'}`"
        @click="changeLike"
      >
        <div class="iconfont icon-like"></div>
        <div class="button-text">{{ videoInfo?.likeCount }}</div>
      </div>
      <div
        :class="`zj-brief_button-panel--btn ${videoInfo?.videoStatus.collect && 'active'}`"
        @click="changeCollect"
      >
        <div class="iconfont icon-shoucang"></div>
        <div class="button-text">{{ videoInfo?.collectCount }}</div>
      </div>
      <div
        :class="`zj-brief_button-panel--btn ${videoInfo?.videoStatus.insert && 'active'}`"
        @click="changeinsert"
      >
        <div class="iconfont icon-toubix"></div>
        <div class="button-text">{{ videoInfo?.coinCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  videoInfo: {
    userInfo: {
      id: string
      nickName: string
      avatar: string
      signature: string
      followed: boolean
      self: boolean
    }

    title: string //视频标题
    description: string //视频简介
    likeCount: number //视频点赞数
    danmakuCount: number //弹幕数
    coinCount: number //视频投币数量
    viewCount: number //视频播放量
    collectCount: number //视频收藏数
    publishTime: string //视频发布时间
    videoStatus: {
      liked: boolean //是否点赞
      collect: boolean //是否收藏
      insert: boolean //是否投币
    }
  }
}
const props = defineProps<Props>()
const emit = defineEmits(['like', 'collect', 'insert'])
//点赞
const changeLike = (): void => {
  emit('like', !props.videoInfo?.videoStatus.liked)
}
//收藏
const changeCollect = (): void => {
  emit('collect', !props.videoInfo?.videoStatus.collect)
}
//投币
const changeinsert = (): void => {
  emit('insert', !props.videoInfo?.videoStatus.insert)
}
</script>

<style lang="scss" scoped>
@include b(brief) {
  color: #ffff;
  padding: 0 15px;
  @include e(info) {
    @include m(title) {
      margin-top: 10px;
      font-size: 16px;
      line-height: 22px;
      padding-right: 70px;
    }
    @include m(info-panel) {
      margin-top: 5px;
      display: flex;
      .iconfont {
        color: #888c92;
        margin-right: 10px;
        font-size: 12px;
      }
    }
  }
  @include e(button-panel) {
    display: flex;
    font-size: 12px;
    color: #9fa4ab;
    justify-content: space-around;
    @include m(btn) {
      cursor: pointer;
      width: 60px;
      border-radius: 5px;
      margin-top: 10px;
      &:hover {
        background-color: rgba($color: #2d2e30, $alpha: 1);
      }
      .iconfont {
        text-align: center;
        margin: 0;
        font-size: 22px;
      }
      .button-text {
        text-align: center;
      }
    }
  }
}
.active {
  color: #ff6699;
}
</style>
