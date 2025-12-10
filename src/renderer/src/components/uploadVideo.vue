<template>
  <div class="zj-uploadfile">
    <div class="zj-uploadfile_filebutton">
      <template v-if="!uploadAll">
        <n-button strong secondary circle size="tiny" @click="handleToggle">
          <template #icon>
            <span v-if="isPaused" class="iconfont icon-continue"></span>
            <span v-else class="iconfont icon-stop"></span>
          </template>
        </n-button>
        <n-button strong secondary circle size="tiny" @click="handleCanel">
          <template #icon>
            <span class="iconfont icon-clone"></span>
          </template>
        </n-button>
        <n-button strong secondary circle size="tiny">
          <template #icon>
            <span class="iconfont icon-retry"></span>
          </template>
        </n-button>
      </template>
      <template v-else>
        <n-button strong secondary circle size="tiny" @click="handleDlete">
          <template #icon>
            <span class="iconfont icon-clone"></span>
          </template>
        </n-button>
      </template>
    </div>
    <div class="iconfont icon-video"></div>
    <div class="zj-uploadfile_fileoption">
      <div class="filename">
        {{ filename }}
      </div>
      <file-percent :percentage="percentage" :uploaded="uploaded" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isPaused: boolean
  filename: string
  uploadAll: boolean
  percentage: number
  uploaded: {
    uploadedSize: number
    totalSize: number
    uploadSpeed: number
  }
}
defineProps<Props>()
const emit = defineEmits(['toggle', 'dlete', 'cancel'])
const changButton = ref(false)
const handleToggle = (): void => {
  emit('toggle', changButton.value)
}
const handleCanel = (): void => {
  console.log('取消上传')

  emit('cancel')
}
const handleDlete = (): void => {
  emit('dlete')
}
</script>

<style lang="scss" scoped>
@include b(uploadfile) {
  position: relative;
  display: flex;
  align-content: center;
  width: 100%;
  @include e(fileoption) {
    margin-left: 5px;
    align-content: space-evenly;
    flex: 1;
  }
  @include e(filebutton) {
    position: absolute;
    right: 0;
    top: 15px;
  }
}
button {
  margin-left: 5px;
}
.icon-clone {
  font-size: 12px;
}
</style>
