<template>
  <view class="root">
    <image class="logo" mode="aspectFit" src="/static/img/logo.png" />
    <view class="content lh-2">
      <text class="title fs-30">申请获取以下权限</text>
      <text class="explain fs-28">获得登录账号(手机号码)</text>
      <text class="explain fs-28">获得你的公开信息(昵称，头像等)</text>
    </view>

    <button
      v-if="userInfo"
      class="btn-authorization"
      type="primary"
      lang="zh_CN"
      @click="getUserInfo"
    >
      授权信息
    </button>

    <button
      v-else
      class="btn-authorization"
      type="primary"
      lang="zh_CN"
      @getphonenumber="authorization"
      open-type="getPhoneNumber"
    >
      授权登录
    </button>
  </view>
</template>

<script lang="ts">
  import { Response } from "../../static/type";

  export default {
    data() {
      return { userInfo: null };
    },
    onLoad() {
      const { userInfoStorageKey } = getApp().globalData!.$config;
      uni.getStorage({
        key: userInfoStorageKey,
        success: (res) => {
          this.userInfo = res;
        },
      });
    },
    methods: {
      async authorization({ detail }: any) {
        if (!detail.code) return;
        uni.showWaiting({ mask: true });
        const { path, validityDay } = getApp().globalData!.$config;
        try {
          const { code } = detail,
            { data } = await ((<unknown>uni.request({
              url: path.auth,
              data: { code },
            })) as Promise<Response>);
          await uni.setStorage({
            key: "userInfo",
            data: { value: data, validityDay },
          });
          uni.hideWaiting();

          if (!data.PhoneNumber) {
            await ((<unknown>uni.showModal({
              title: "授权用户信息",
              content:
                "首次登录需要获得你的公开信息(昵称，头像)以作为个人中心展示使用",
              showCancel: false,
              confirmText: "立即授权",
            })) as Promise<UniApp.ShowModalRes>);

            return await this.getUserInfo();
          }

          uni.navigateBack({});
        } catch (error) {
          uni.showToast({ title: <string>error, icon: "none" });
        } finally {
          uni.hideWaiting();
        }
      },

      async getUserInfo() {
        uni.showWaiting({ mask: true });
        const { path, validityDay } = getApp().globalData!.$config;

        try {
          const { userInfo } = await ((<unknown>uni.getUserProfile({
              desc: "Improve basic information",
            })) as Promise<UniApp.GetUserProfileRes>),
            { data } = await ((<unknown>uni.request({
              url: path.setUserInfo,
              data: userInfo,
            })) as Promise<Response>);
          uni.setStorage({
            key: "userInfo",
            data: { value: data, validityDay, $type: "update" },
            success: uni.navigateBack,
          });
        } catch (error) {
          uni.showToast({ title: <string>error, icon: "none" });
        } finally {
          uni.hideWaiting();
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .root {
    .logo {
      width: 200rpx;
      height: 200rpx;
      margin: 90rpx auto;
    }

    .content {
      border-top: 1px solid #eee;
      margin: 0 50rpx 90rpx;
      padding-top: 30rpx;
    }

    .content .explain {
      color: #9d9d9d;
    }
    .btn-authorization {
      border-radius: 80rpx;
      margin: 70rpx 50rpx;
      font-size: 35rpx;
    }
  }
</style>
