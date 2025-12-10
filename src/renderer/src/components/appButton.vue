<template>
  <div>
    <button
      :class="['iconfont', `icon-${type}`, { succinct: succinct }]"
      :style="{
        fontSize: `${(size || 5) * 4}px`,
        padding: `${size || 5}px`,
        marginLeft: `${left || 0}px`
      }"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  size?: number
  succinct?: boolean
  type: string
  left?: number
}
defineProps<Props>()
</script>

<style lang="scss" scoped>
button {
  padding: 5px;
  font-size: 20px;
  border: 0;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #dadddf;
  }
}
.succinct {
  color: #ffff;
  background-color: transparent;
  &:hover {
    background-color: #37393d;
  }
}
</style>
