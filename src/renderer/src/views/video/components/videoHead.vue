<template>
  <div class="zj-video-header">
    <div class="zj-video-header_left">
      <n-button color="#2f3134">返回主界面</n-button>
    </div>
    <div class="zj-video-header_right">
      <app-button type="hide" succinct> </app-button>
      <app-button :left="10" type="shrink" succinct></app-button>
      <app-button :left="10" type="clone" succinct @click="cloneWind"></app-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['clone'])
const cloneWind = (): void => {
  window.api.cloneWindow('child_window_video')
  emit('clone')
}
</script>

<style lang="scss" scoped>
@include b(video-header) {
  width: 100%;
  padding: 5px 10px;
  background-color: #1e2022;
  display: flex;
  @include e(left) {
    flex: 1;
  }
  @include e(right) {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
