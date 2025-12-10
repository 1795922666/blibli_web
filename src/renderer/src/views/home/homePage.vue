<template>
  <div>
    <indexHead></indexHead>
    <div class="zj-blibli">
      <sidebar></sidebar>
      <div class="zj-blibli_content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@include b(blibli) {
  display: flex;
  width: 100%;
  height: 92vh;
  background-color: #ffffff;
  @include e(content) {
    flex: 1;
  }
}
</style>
