<template>
  <view class="page">
    <view
      style="border-radius: 24rpx; width: 720rpx; background-color: rgba(0, 0, 0, 0.1);  box-shadow: inset 0 0 18rpx #333; padding: 30rpx;">
      <image class="width-120 height-120 as-center p-30" src="/static/logo.png" mode="aspectFit" />

      <text class="mt-30 color-title fs-36 fw-500 lh-100 fw-600">系统登录</text>

      <view :style="{ padding: `30rpx`, borderTop: `2rpx #ececec solid` }">
        <label>
          <uni-icons class="mr-30" type="person-filled" size="24" color="#fff" />
          <uni-easyinput v-model="form.account" class="f1 height-66" type="number" placeholder="手机号/邮箱" />
        </label>
        <label class="mt-44">
          <uni-icons class="mr-30" type="locked-filled" size="24" color="#fff" />
          <uni-easyinput v-model="form.password" class="f1 height-66" type="password" placeholder="密码" />
        </label>

        <text @click="uniNavigator({ url: `/pages/auth/reset` })" :style="{
          cursor: `pointer`,
          textDecoration: `underline`,
        }" class="as-end mt-30 color-inverse fs-24">
          忘记密码？
        </text>
        <button class="bgc-btn mt-60 lh-66 fs-32 ml-0 mr-0 color-inverse" hover-class="tap-hover" @click="login">
          登录
        </button>

        <text @click="uniNavigator({ url: `/pages/auth/register` })" :style="{
          cursor: `pointer`,
          textDecoration: `underline`,
        }" class="as-center mt-90 color-inverse fs-24">
          如无账号，请先注册...
        </text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { uniNavigator } from "@/common/libs/utils";

const { PAGE_CLIENT_HOME } = getApp().globalData!.$config;

const form = reactive({
  account: "",
  password: ""
});

function login() {
  uniNavigator({ type: "reLaunch", url: PAGE_CLIENT_HOME });
}
</script>

<style lang="scss">
// scss
page {
  height: 100%;
}

.page {
  // #ifdef APP-PLUS
  height: 100vh;
  // #endif
  // #ifndef APP-PLUS
  height: 100%;
  // #endif

  justify-content: center;
  align-items: center;
}
</style>