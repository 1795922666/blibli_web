<template>
  <div class="zj-file">
    <div class="zj-file_speed">
      上传速度: {{ formatSpeed(uploaded.uploadSpeed) }} | 已上传:
      {{ formatFileSize(uploaded.uploadedSize) }} / {{ formatFileSize(uploaded.totalSize) }}
    </div>
    <n-progress type="line" :height="5" processing :percentage="percentage" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  percentage: number
  uploaded: {
    uploadedSize: number
    totalSize: number
    uploadSpeed: number
  }
}
defineProps<Props>()
const formatSpeed = (bytesPerSecond: number): string => {
  if (bytesPerSecond < 1024) return `${bytesPerSecond.toFixed(0)} B/s`
  if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`
}
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}
</script>

<style lang="scss" scoped>
@include b(file) {
  @include e(speed) {
    color: #999999;
    font-size: 11px;
  }
}
</style>
