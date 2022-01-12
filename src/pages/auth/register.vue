<template>
  <view class="f1 jc-center" :style="{ padding: `0 60rpx 240rpx` }">
    <image
      class="width-80 height-80 as-center"
      src="/static/img/logo.png"
      mode="aspectFit"
    />

    <text class="mt-60 color-333 fs-32 fw-500 lh-100">系统注册</text>

    <view :style="{ padding: `30rpx`, borderTop: `2rpx #ececec solid` }">
      <label>
        <uni-icons
          class="mr-30"
          type="person-filled"
          size="18"
          color="#606266"
        />
        <uni-easyinput type="number" placeholder="账号" />
      </label>
      <label class="mt-44">
        <uni-icons
          class="mr-30"
          type="locked-filled"
          size="18"
          color="#606266"
        />
        <uni-easyinput type="password" placeholder="密码" />
      </label>
      <label class="mt-44">
        <uni-icons
          class="mr-30"
          type="locked-filled"
          size="18"
          color="#606266"
        />
        <uni-easyinput type="password" placeholder="确认密码" />
      </label>

      <view class="fd-row">
        <button
          class="f1 bgc-409eff mt-90 lh-60 fs-28 color-fff"
          hover-class="tap-hover"
        >
          注册
        </button>
        <button
          class="ml-20 f1 mt-90 lh-60 fs-28"
          hover-class="tap-hover"
          @click="goBack"
        >
          返回
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onLoad } from "@dcloudio/uni-app";
  import { ref } from "vue";

  const title = ref("login");
  onLoad(() => {});

  const goBack = () => uni.navigateBack({});
</script>

<style lang="scss" scoped>
  // scss
  page {
    max-width: 840rpx;
    margin: auto;
  }
</style>