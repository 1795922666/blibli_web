<template>
  <div class="zj-userInfo" :style="{ top: top + 'px' }">
    <div class="zj-userInfo_avatar">
      <n-avatar
        v-if="userInfo"
        round
        :size="size"
        :fallback-src="defaultImage"
        :src="`/api/user/getAvatara?path=${userInfo?.id}`"
      >
      </n-avatar>
      <n-skeleton v-else :width="`${size}px`" :height="`${size}px`" round />
    </div>
    <div :class="`zj-userInfo_info ${buttonType}`">
      <template v-if="userInfo">
        <div class="zj-userInfo_info_mi">
          <div class="zj-userInfo_info_mi--name" :style="nameStyle">
            {{ userInfo?.nickName }}
          </div>
          <div class="zj-userInfo_info_mi--signature">
            {{
              buttonType == 'comment'
                ? formatTimeDifference(userInfo.signature)
                : userInfo?.signature
            }}
          </div>
        </div>
        <div v-if="showFollow" class="userId iconfont icon-up">
          {{ userInfo?.id }}
        </div>
        <div v-else-if="!userInfo?.self" :class="`zj-userInfo_info_btn btn-${buttonType}`">
          <n-button
            v-if="userInfo.followed"
            :style="{ width: 70 + 'px', height: 30 + 'px' }"
            type="primary"
            color="#666"
            secondary
            @click="following(false)"
            >已关注</n-button
          >
          <n-button
            v-else
            :style="{ width: 70 + 'px', height: 30 + 'px' }"
            type="primary"
            @click="following(true)"
            >关注</n-button
          >
        </div>
      </template>
      <n-skeleton v-else width="200px" height="50px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultImage from '@renderer/assets/images/default.png'
import { follow } from '@api'
import { defineProps, type StyleValue } from 'vue'
import { formatTimeDifference } from '@renderer/utils/dateUtils'
import type { UserInfo } from '../views/home/userSpace/types'
interface Props {
  userInfo: UserInfo | null
  top?: number
  size: number
  nameStyle?: StyleValue
  showFollow?: boolean //false个人空间类型|true关注列表类型
  buttonType?: string //需showFollow为true video视频详情类型|comment评论列表类型
}
const props = defineProps<Props>()
const following = async (bol: boolean): Promise<void> => {
  const res = await follow(props.userInfo?.id as string, bol)
  if (res) {
    props.userInfo!.followed = !props.userInfo!.followed
  }
}
</script>

<style lang="scss" scoped>
@include b(userInfo) {
  position: relative;
  display: flex;
  @include e(avatar) {
    line-height: 100%;
    margin-right: 10px;
  }
  @include e(info) {
    line-height: 18px;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    @include e(mi) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      @include m(name) {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 5px;
      }
      @include m(signature) {
        font-size: 12px;
        color: #666;
      }
    }
    @include e(btn) {
      display: flex;
      flex: 1;
      justify-content: start;
      align-items: center;
    }
  }
}
.video {
  flex-direction: row;
  justify-content: flex-start;
}
.comment {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.btn-video {
  justify-content: end;
}
.btn-comment {
  display: none;
}
.iconfont {
  font-size: 12px;
  color: #666;
}
</style>
