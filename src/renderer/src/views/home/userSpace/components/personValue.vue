<template>
  <div class="zj-personValue">
    <template v-if="userInfo">
      <router-link :to="`/home/${route.params.userId}/followlist`" class="zj-personValue_box">
        <div class="zj-personValue_box--value">{{ userInfo?.followerCount }}</div>
        <div class="zj-personValue_box--title">关注数</div>
      </router-link>
      <n-divider vertical />
      <router-link to="/" class="zj-personValue_box">
        <div class="zj-personValue_box--value">{{ userInfo?.followingCount }}</div>
        <div class="zj-personValue_box--title">粉丝数</div>
      </router-link>
      <n-divider vertical />
      <span class="zj-personValue_box">
        <div class="zj-personValue_box--value">{{ userInfo?.likeCount }}</div>
        <div class="zj-personValue_box--title">获赞数</div>
      </span>
      <div v-if="!userInfo?.self" class="zj-personValue_buttongruop">
        <n-button
          v-if="userInfo?.followed"
          type="primary"
          color="#666"
          secondary
          @click="follows(false)"
          >已关注</n-button
        >
        <n-button v-else type="primary" @click="follows(true)">关注</n-button>
        <n-button type="primary" ghost>发消息</n-button>
      </div>
    </template>
    <n-skeleton v-else width="100%" height="95px" />
  </div>
</template>

<script setup lang="ts">
import { follow } from '@api'
import type { UserInfo } from '../types'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
interface Props {
  userInfo: UserInfo | null
}
const props = defineProps<Props>()
const followingCount = ref(0)
const follows = async (bol: boolean): Promise<void> => {
  const res = follow(props.userInfo?.id as string, bol)
  if (res) {
    props.userInfo!.followed = bol
    props.userInfo!.followingCount += bol ? 1 : -1
    followingCount.value = bol ? 1 : -1
  }
}
</script>

<style lang="scss" scoped>
@include b(personValue) {
  display: flex;
  max-width: 450px;
  height: 100%;
  margin-left: auto;
  align-items: center;
  color: black;
  text-align: center;
  @include e(box) {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @include m(title) {
      font-size: 12px;
      color: #666;
    }
  }
  @include e(buttongruop) {
    margin-left: 20px;
    button {
      width: 90px;
      margin: 0 5px;
    }
  }
}
</style>
