<template>
  <div class="move"></div>
  <div class="zj-login" :class="changeImage ? 'inputpassword' : ''">
    <app-button type="clone" class="clone" @click="cloneWind"></app-button>
    <div class="zj-login_content">
      <div class="zj-login_content--qrcode">
        <div class="zj-login_content--qrcode--title">扫描二维码登陆</div>
        <n-qr-code :size="100" :value="1111111" />
      </div>
      <div class="zj-login_line"></div>
      <div class="zj-login_content--from">
        <div class="zj-login_content--from_tab">
          <span
            :class="{ 'zj-login_content--from_tab--title': true, active: inputStatus == 'login' }"
            @click="changeInputStatus('login')"
            >密码登陆</span
          >
          <div class="zj-login_line"></div>
          <span
            :class="{
              'zj-login_content--from_tab--title': true,
              active: inputStatus == 'register'
            }"
            @click="changeInputStatus('register')"
            >用户注册</span
          >
        </div>
        <div class="zj-login_content--from_wp" style="margin: 40px 0">
          <div class="form__item" style="border-radius: 10px 10px 0 0; border-bottom: 0">
            <div class="form_info">账号</div>
            <input v-model="formValue.name" maxlength="20" placeholder="请输入账号" type="text" />
          </div>
          <div
            v-if="inputStatus == 'register'"
            class="form__item"
            style="border-radius: 0 0 0 0; border-bottom: 0"
          >
            <div class="form_info">手机号码</div>
            <input
              v-model="formValue.phone"
              maxlength="11"
              placeholder="输入手机号码"
              type="text"
            />
          </div>
          <div
            class="form__item"
            :style="{ 'border-radius': inputStatus == 'register' ? '0 0 0 0' : '0 0 10px 10px ' }"
          >
            <div class="form_info">密码</div>
            <input
              v-model="formValue.password"
              maxlength="20"
              placeholder="请输入密码"
              type="password"
              @blur="changeImage = false"
              @focus="changeImage = true"
            />
          </div>
          <div
            v-if="inputStatus == 'register'"
            class="form__item"
            style="border-radius: 0 0 10px 10px; border-top: 0"
          >
            <div class="form_info">重复密码</div>
            <input
              v-model="formValue.passwordRepeat"
              maxlength="20"
              placeholder="重复输入密码"
              type="password"
              @blur="changeImage = false"
              @focus="changeImage = true"
            />
          </div>
        </div>
        <div v-if="inputStatus == 'login'" class="zj-login_content--from_submit">
          <n-button @click="changeInputStatus('register')">注册</n-button
          ><n-button color="#ff82ac" :disabled="!logform" @click="submit('login')">登陆</n-button>
        </div>
        <div v-else class="zj-login_content--from_submit" style="justify-content: center">
          <n-button color="#ff82ac" :disabled="!regform" @click="submit('register')">注册</n-button>
        </div>
      </div>
    </div>
    <div class="zj-login_footer">
      <div class="zj-login_footer--title">
        未注册过哔哩哔哩的手机号，我们将自动帮你注册账号 登录或完成注册即代表你同意 用户协议 和
        隐私政策
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { login, register } from '@api'
import { useAuthStore } from '@store'

const authStore = useAuthStore()
const inputStatus = ref('login')
const changeImage = ref(false)
const logform = computed(() => (formValue.name == '' || formValue.password == '' ? false : true))
const regform = computed(() =>
  formValue.name !== '' &&
  formValue.password !== '' &&
  formValue.passwordRepeat !== '' &&
  formValue.phone !== ''
    ? true
    : false
)
const formValue = reactive({
  name: '',
  password: '',
  phone: '',
  passwordRepeat: ''
})
const changeInputStatus = (status: string): void => {
  inputStatus.value = status
}
const submit = async (type: string): Promise<void> => {
  // 登录逻辑
  if (type == 'login') {
    const user = Object.assign({}, { userName: formValue.name, password: formValue.password })
    const res = await login(user)
    if (!res) {
      return
    }
    authStore.getUser()
    cloneWind()
    return
  }
  // 注册逻辑
  const user = Object.assign(
    {},
    { userName: formValue.name, password: formValue.password, phone: formValue.phone }
  )
  const res = await register(user)
  if (!res) {
    inputStatus.value = 'login'
  }
}
const cloneWind = (): void => {
  window.api.cloneWindow('child_window_login')
}
</script>

<style lang="scss" scoped>
@include b(login) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  position: relative;
  background-image:
    url('../../assets/images/login_left.png'), url('../../assets/images/login_right.png');
  background-position:
    0 100%,
    100% 100%;
  background-size: 14%;
  padding: 40px 60px;
  user-select: none;
  background-repeat: no-repeat, no-repeat;
  .clone {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  @include e(content) {
    display: flex;
    justify-content: space-between;
    @include m(qrcode) {
      width: 173;
      height: 300px;
      @include m(title) {
        text-align: center;
        font-size: 18px;
      }
    }
    @include m(from) {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 400px;
      height: 100%;
      @include e(tab) {
        display: flex;
        align-items: center;
        height: 25px;
        @include m(title) {
          font-size: 16px;
          cursor: pointer;
        }
      }
      @include e(submit) {
        display: flex;
        width: 100%;
        justify-content: space-between;
        button {
          width: 47%;
          height: 38px;
        }
      }
    }
  }

  @include e(line) {
    width: 1px;
    height: 100%;
    background-color: #d9d9d9;
    margin: 0 25px;
  }
  @include e(footer) {
    @include m(title) {
      width: 300px;
      margin: 0 auto;
      font-size: 12px;
      text-align: center;
      color: #999999;
    }
  }
}
.form__item {
  display: flex;
  width: 400px;
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  input {
    margin-left: 20px;
    flex: 1;
    outline: none;
    border: none;
    &::placeholder {
      color: #d9d9d9;
    }
  }
}
.move {
  position: absolute;
  width: 100%;
  height: 30px;
  -webkit-app-region: drag;
}
.active {
  color: #ff82ac;
}
.inputpassword {
  background-image:
    url('../../assets/images/login_left-password.png'),
    url('../../assets/images/login_right-password.png');
}
</style>
