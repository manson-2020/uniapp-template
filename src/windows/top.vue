<template>
  <view class="height-100percent" style="padding: 15px 15px 0;">
    <view class="fd-row bgc-4 height-100percent p-30 bgc-primary br-12" style="border-bottom: 3px solid #0c1322;">
      <view v-if="matchLeftWindow" class="f1 fd-row oh">
        <label @click="toHome">
          <u-image :fade="false" width="60" height="60" radius="11" class="bgc-grey" src="/static/logo.png"
            mode="aspectFit" />
          <text class="ml-18 color-inverse fs-28">Admin System</text>
        </label>

        <scroll-view class="f1 ml-180 mr-20 oh" scroll-x>
          <view class="fd-row height-100percent">
            <label @click="onClickItems({ menuIndex })" v-for="(menu, menuIndex) in menuItems" style="flex-shrink: 0;"
              :class="[`color-${$route!.path.includes(menu.dir) ? 'primary' : 'inverse'}`, `height-100percent width-150 jc-center`]">
              {{ menu.title }}
            </label>
          </view>
        </scroll-view>
      </view>
      <uni-icons v-else class="as-center" :style="{ padding: `30rpx 30rpx 30rpx 0`, transform: `scale(1, 0.7)` }"
        type="list" size="30" color="#fff" @click="toggleLeftWindow" />
      <label v-if="!matchLeftWindow" class="ellipsis f1 text-center lh-3 fs-28 color-inverse ml-30 mr-30">
        {{ navigationBarTitleText }}
      </label>
      <label @click="showActionItems" :style="{ padding: `16rpx` }">
        <uni-icons type="person-filled" size="16" color="#eee" />
        <text class="ml-8 mr-8 color-inverse fs-28">admin</text>
        <uni-icons type="arrowdown" size="14" color="#999" />
      </label>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    navigationBarTitleText: String,
    matchLeftWindow: Boolean,
    showLeftWindow: Boolean,
  },
  data: () => ({
    menuItems: [
      {
        icon: "star-filled",
        title: "系统管理",
        open: true,
        dir: "/pages/admin",
        children: [
          {
            icon: "list",
            title: "管理菜单",
            dir: "/pages/admin",

            path: "/index",
          },
          {
            disabled: true,
            icon: "list",
            title: "管理菜单",
            dir: "/pages/admin",
            path: "/index1",
          },
          {
            icon: "list",
            title: "管理菜单",
            dir: "/pages/admin",
            path: "/index2",
          },
        ],
      },
    ] as any[],
    config: getApp().globalData!.$config as any
  }),
  methods: {
    toggleLeftWindow() {
      uni.showLeftWindow({});
    },
    showActionItems() {
      uni.showActionSheet({
        itemList: ["修改密码", "退出登录"],
        itemColor: "#666",

        success: ({ tapIndex }) => {
          switch (tapIndex) {
            case 1:
              uni.clearStorage();
              uni.reLaunch({ url: this.config.PAGE_LOGIN_ACCOUNT });
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
    onClickItems({ menuIndex, itemIndex }: { menuIndex: number; itemIndex?: number; }) {
      const menu = this.menuItems[menuIndex];
      if (itemIndex !== undefined) {
        const item = menu.children[itemIndex];
        let url = item.dir + item.path;
        url === this.$route!.path || uni.navigateTo({ url: item.dir + item.path, success: () => uni.hideLeftWindow({}) });
        return;
      }

      if (!menu.children) {
        let url = menu.dir + menu.path;
        url === this.$route!.path || uni.navigateTo({ url, success: () => uni.hideLeftWindow({}) });
        return;
      }
      // 若有下级则展示下级
    },
    toHome() {
      uni.reLaunch({ url: this.config.PAGE_CLIENT_HOME });
    },
  },
});
</script>

<style lang="scss" scoped>
// scss
</style>