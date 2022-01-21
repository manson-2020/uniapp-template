<template>
  <view class="f1 jc-center" :style="{ padding: `0 60rpx 240rpx` }">
    <image
      class="width-80 height-80 as-center"
      src="/static/img/logo.png"
      mode="aspectFit"
    />

    <text class="mt-60 color-333 fs-32 fw-500 lh-100">系统登录</text>

    <view :style="{ padding: `30rpx`, borderTop: `2rpx #ececec solid` }">
      <label>
        <uni-icons
          class="mr-30"
          type="person-filled"
          size="18"
          color="#606266"
        />
        <uni-easyinput type="number" placeholder="手机号/邮箱" />
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

      <text
        @click="to(`navigateTo`, `/pages/auth/reset`)"
        :style="{
          cursor: `pointer`,
          textDecoration: `underline`,
        }"
        class="as-end mt-30 color-007aff fs-26 opacity-dot8"
      >
        忘记密码？
      </text>
      <button
        class="bgc-409eff mt-60 lh-60 fs-28 ml-0 mr-0 color-fff"
        hover-class="tap-hover"
        @click="login"
      >
        登录
      </button>

      <text
        @click="to('navigateTo', `/pages/auth/register`)"
        :style="{
          cursor: `pointer`,
          textDecoration: `underline`,
        }"
        class="as-center mt-90 color-007aff fs-26 opacity-dot8"
      >
        如无账号，请先注册...
      </text>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onLoad, onUnload } from "@dcloudio/uni-app";
  import $config from "../../static/libs/config";

  const to = (
    method: "reLaunch" | "navigateTo" | "switchTab" | "redirectTo",
    url: string
  ) => uni[method]({ url });

  const login = (keyboard?: KeyboardEvent) => {
    if (keyboard && keyboard.key && keyboard.key !== "Enter") return;
    uni.showActionSheet({
      itemList: ["user", "admin"],
      itemColor: "#666",
      success: ({ tapIndex }) => {
        to(`reLaunch`, [$config.page.userHome, $config.page.adminHome][tapIndex]);
      },
    });
  };

  onLoad(() => {
    // #ifdef H5
    document.addEventListener("keydown", login);
    // #endif
  });

  onUnload(() => {
    // #ifdef H5
    document.removeEventListener("keydown", login);
    // #endif
  });
</script>

<style lang="scss" scoped>
  // scss
  page {
    max-width: 750rpx;
    margin: auto;
  }
</style>