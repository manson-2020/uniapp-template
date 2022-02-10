<template>
  <view
    class="root fd-row jc-sb bgc-fff height-100percent ai-center pl-50 pr-50"
    :style="{ borderBottom: `1px solid #ebebeb` }"
  >
    <label v-if="showLeftWindow" @click="toHome">
      <image
        class="width-60 height-60"
        src="/static/img/logo.png"
        mode="aspectFit"
      />
      <text class="ml-18 color-999 fs-28">uni-app Admin</text>
    </label>
    <uni-icons
      v-else
      :style="{ transform: `scale(1, 0.7)` }"
      type="bars"
      size="30"
      color="#999"
      @click="toggleLeftWindow"
    />

    <text
      v-if="!showLeftWindow"
      class="ellipsis f1 text-center fs-28 lh-2 color-999 ml-30 mr-30"
    >
      {{ navigationBarTitleText || $route.meta.navigationBar?.titleText }}
    </text>
    <label
      @click="showActionItems"
      :style="{ padding: `16rpx` }"
      class="ai-center"
    >
      <uni-icons type="person-filled" size="16" color="#666" />
      <text class="ml-8 mr-8 color-999 fs-28">admin</text>
      <uni-icons type="arrowdown" size="14" color="#999" />
    </label>
  </view>
</template>

<script lang="ts">
  import $config from "../static/libs/config";
  export default {
    props: {
      navigationBarTitleText: {
        type: String,
      },
      matchLeftWindow: {
        type: Boolean,
      },
      showLeftWindow: {
        type: Boolean,
      },
    },
    data: () => ({
      displayLeftWindow: false,
    }),
    created() {
      this.displayLeftWindow = this.showLeftWindow;
    },
    methods: {
      toggleLeftWindow() {
        uni[this.displayLeftWindow ? "hideLeftWindow" : "showLeftWindow"]({
          success: () => {
            this.displayLeftWindow = !this.displayLeftWindow;
          },
        });
      },
      showActionItems() {
        uni.showActionSheet({
          itemList: ["Change Password", "Logout"],
          itemColor: "#666",

          success: ({ tapIndex }) => {
            switch (tapIndex) {
              case 1:
                uni.clearStorage();
                uni.reLaunch({ url: $config.page.auth });
                break;
              case 0:
                uni.navigateTo({ url: "/pages/auth/reset" });
                break;
              default:
                break;
            }
          },
        });
      },
      toHome() {
        uni.reLaunch({ url: $config.page.adminHome });
      },
    },
  };
</script>

<style lang="scss" scoped>
  // scss
</style>