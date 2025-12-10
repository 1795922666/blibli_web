<template>
  <div>
    <NConfigProvider :theme-overrides="themeOverrides">
      <router-view></router-view>
    </NConfigProvider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const themeOverrides = ref({
  common: {
    primaryColor: '#ff6699',
    primaryColorHover: '#ff77a3',
    primaryColorPressed: '#e65c8c',
    primaryColorSuppl: '#ff6699'
  }
})
</script>

<style lang="scss" scoped></style>
