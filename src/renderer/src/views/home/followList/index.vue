<template>
  <div class="zj-followlist">
    <div v-for="item in userInfos" :key="item.id" class="zj-followlist_box">
      <personal-info :size="80" :user-info="item"></personal-info>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { followlist } from '@api'
import { useRoute } from 'vue-router'
const route = useRoute()
interface UserInfo {
  id: string
  nickName: string
  avatar: string
  signature: string
  followingCount: number
  followerCount: number
  followed: boolean
  self: boolean
  likeCount: number
}

const userInfos = ref<UserInfo[]>()
const getList = async (): Promise<void> => {
  const res = await followlist(route.params.userId as string)
  if (res) {
    userInfos.value = res.data.data
  }
}
onMounted(async () => {
  getList()
})
</script>

<style lang="scss" scoped>
@include b(followlist) {
  display: grid;
  padding: 20px;
  grid-template-columns: 1fr 1fr;
  @include e(box) {
    margin-top: 15px;
  }
}
</style>
