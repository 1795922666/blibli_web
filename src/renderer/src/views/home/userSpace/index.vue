<template>
  <div class="zj-userspace">
    <div class="zj-userspace_header">
      <img class="background" src="../../../assets/images/1sz3p8w2Sk.png@3840w_400h_1c.avif" />
    </div>
    <div class="zj-userspace_body">
      <div class="zj-userspace_content">
        <div class="zj-userspace_content--left">
          <personal-info :size="80" :user-info="userInfos" :top="-10" show-follow></personal-info>
        </div>
        <div class="zj-userspace_content--right">
          <person-value :user-info="userInfos"></person-value>
        </div>
      </div>
      <n-tabs type="line" animated style="margin-left: 10px">
        <n-tab name="投稿" tab="投稿"> </n-tab>
        <n-tab name="动态" tab="动态"> </n-tab>
      </n-tabs>
    </div>
    <n-infinite-scroll style="height: 100%" :distance="20" @load="handleLoad">
      <div class="green">
        <div class="zj-video">
          <n-grid cols="2 s:3 m:4 l:5 xl:5 2xl:5" :x-gap="20" responsive="screen">
            <n-grid-item v-for="(item, index) in userContr" :key="index">
              <videos-card :video-info="item" :loading="false"></videos-card>
            </n-grid-item>
          </n-grid>
        </div>
      </div>
    </n-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import personValue from './components/personValue.vue'
import { onMounted, ref, watch } from 'vue'
import type { UserInfo } from './types'
import { useRoute } from 'vue-router'
import { getUserSpace, getContribution } from '@api'
const route = useRoute()
const newUserId = route.params.userId as string
watch(
  () => route.params.userId,
  async (value) => {
    await userSpace(value as string)
  }
)
// 拿到路由传过来的id参数请求
const userInfos = ref<UserInfo | null>(null)
const userContr = ref([])
// 获取用户空间信息
const userSpace = async (id: string): Promise<void> => {
  const { data } = await getUserSpace(id)
  if (data) {
    userInfos.value = data.data
  }
}
const contribution = async (): Promise<void> => {
  const { data } = await getContribution()
  if (data) {
    userContr.value = data.data
  }
}
const handleLoad = (): void => {}
onMounted(async () => {
  await userSpace(newUserId)
  await contribution()
})
</script>

<style lang="scss" scoped>
.background {
  display: block;
  width: 100%;
  object-fit: cover;
}
@include b(userspace) {
  @include e(header) {
    max-width: 1600px;
    margin: 0 auto;
  }
  @include e(body) {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
  }
  @include e(content) {
    display: flex;
    justify-content: space-between;
    @include m(left) {
      flex: 1;
    }
    @include m(right) {
      flex: 1;
    }
  }
}
.zj-video {
  max-width: 1600px;
  flex: 1;
}

.green {
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 10px 30px;
}
</style>
