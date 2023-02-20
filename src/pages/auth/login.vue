<template>
  <view class="f1 jc-center">
    <image class="width-120 height-120 as-center" src="/static/logo.png" mode="aspectFit" />

    <text class="mt-60 color-primary fs-36 fw-500 lh-100">系统登录</text>

    <view :style="{ padding: `30rpx`, borderTop: `2rpx #ececec solid` }">
      <label>
        <uni-icons class="mr-30" type="person-filled" size="24" color="#606266" />
        <uni-easyinput v-model="form.account" class="f1 height-100" type="number" placeholder="手机号/邮箱" />
      </label>
      <label class="mt-44">
        <uni-icons class="mr-30" type="locked-filled" size="24" color="#606266" />
        <uni-easyinput v-model="form.password" class="f1 height-100" type="password" placeholder="密码" />
      </label>

      <text @click="to(`navigateTo`, `/pages/auth/reset`)" :style="{
        cursor: `pointer`,
        textDecoration: `underline`,
      }" class="as-end mt-30 color-normal fs-26 opacity-dot8">
        忘记密码？
      </text>
      <button class="bgc-primary mt-60 lh-88 fs-32 ml-0 mr-0 color-inverse" hover-class="tap-hover" @click="login">
        登录
      </button>

      <text @click="to('navigateTo', `/pages/auth/register`)" :style="{
        cursor: `pointer`,
        textDecoration: `underline`,
      }" class="as-center mt-90 color-normal fs-26 opacity-dot8">
        如无账号，请先注册...
      </text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import $config from "@/static/config";

const { PAGE_CLIENT_HOME } = $config;
const to = (
  method: "reLaunch" | "navigateTo" | "switchTab" | "redirectTo",
  url: string
) => uni[method]({ url });

const form = reactive({
  account: "",
  password: ""
});

function login() {
  to(`reLaunch`, PAGE_CLIENT_HOME);
}
</script>

<style lang="scss">
// scss
page {
  height: 100%;
  width: 450px;
  margin: 0 auto;
}
</style>