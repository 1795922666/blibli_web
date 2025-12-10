<template>
  <div class="zj-coin"></div>
  <n-modal
    v-model:show="showModal"
    :bordered="false"
    style="--n-color-modal: #212226; --n-close-icon-color: #fff; --n-text-color: #fff; width: 370px"
    preset="card"
  >
    <template #header><div class="zj-coin_header">投币</div> </template>
    <div class="zj-coin_content">
      <div class="zj-coin_content--tip">
        请选择你的投币数量<span class="number">{{ coin }}个</span>
      </div>
      <div class="zj-coin_content--mc">
        <div :class="`zj-coin_content--mc_box btn ${coin == 2 || 'active'}`" @click="chageCoin(1)">
          <div class="zj-coin_content--mc_box_run">
            <img src="../../../assets/images/22-coin-ani.png" />
          </div>
        </div>
        <div
          v-if="maxcoin >= 2"
          :class="`zj-coin_content--mc_box btn ${coin == 1 || 'active'}`"
          @click="chageCoin(2)"
        >
          <div class="zj-coin_content--mc_box_run">
            <img src="../../../assets/images/33-coin-ani.png" />
          </div>
        </div>
      </div>
      <div class="zj-coin_content--pinal">
        <div class="zj-coin_content--pinal_balance">
          硬币余额:<span class="number md">{{ userCoin }}</span>
        </div>
        <div>{{ userCoin >= coin ? '余额充足,可以投币' : '余额不足' }}</div>
      </div>
    </div>
    <template #footer>
      <div class="zj-coin_footer">
        <n-button
          color="#46494d"
          size="large"
          style="width: 150px; height: 40px"
          @click="showModal = false"
          >取消</n-button
        >
        <n-button color="#d44e7d" size="large" style="width: 150px; height: 40px" @click="insert"
          >确认投币</n-button
        >
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, type Ref, watch, defineEmits } from 'vue'
interface domExpose {
  show: Ref<boolean>
  coinCount: Ref<number>
  maxcoin: Ref<number>
}
const emit = defineEmits(['insert'])
const showModal = ref(false)
const userCoin = ref(0)
// 用户对当前视频最大投币数量
const maxcoin = ref(2)
// 当前用户选择投币数量
const coin = ref(maxcoin.value)
// 选择投币数量变化
watch(
  () => maxcoin.value,
  (newValue) => {
    coin.value = newValue
  }
)
const chageCoin = (num: number): void => {
  coin.value = num
}
// 投币
const insert = (): void => {
  emit('insert', coin.value)
}
defineExpose<domExpose>({ show: showModal, maxcoin: maxcoin, coinCount: userCoin })
</script>

<style lang="scss" scoped>
@include b(coin) {
  @include e(header) {
    text-align: center;
    color: #ffff;
  }
  @include e(content) {
    font-size: 12px;
    color: #63676d;
    @include m(tip) {
      text-align: center;
      margin: 5px 0 10px 0;
    }
    @include m(mc) {
      display: flex;
      justify-content: space-around;
      @include e(box) {
        border: 4px solid transparent;
        border-radius: 5px;
        background-color: #37383b;
        @include e(run) {
          width: 120px;
          height: 206px;
          margin: 0 13px;
          overflow: hidden;
        }
      }
    }
    @include m(pinal) {
      margin-top: 10px;
      @include e(balance) {
        font-size: 14px;
        color: #fff;
      }
    }
  }
  @include e(footer) {
    display: flex;
    justify-content: space-between;
  }
}
.active {
  border-color: #d44e7d;
}
img {
  height: 193px;
  animation: play-coin 3s steps(23) infinite;
}

@keyframes play-coin {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-2767px, 0, 0);
  }
}
</style>
