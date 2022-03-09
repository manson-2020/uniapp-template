<template>
  <view class="root">
    <image class="logo" mode="aspectFit" src="/static/img/logo.png" />
    <view class="content lh-2">
      <text class="title fs-30">申请获取以下权限</text>
      <text class="explain fs-28">获得你的公开信息(昵称，头像等)</text>
    </view>

    <button
      class="btn-authorization"
      type="primary"
      lang="zh_CN"
      @click="authorization"
    >
      授权登录
    </button>
  </view>
</template>

<script lang="ts">
  const { path, page, validityDay, userInfoStorageKey } =  {} as any; //getApp()!.globalData!.$config;

  export default {
    onLoad() {
      uni.getStorage({
        key: userInfoStorageKey,
        success: (res) => {
          uni.showWaiting({ title: "loading···", mask: true });
          if (!res) return;
          uni.reLaunch({
            url: page.home,
            complete: uni.hideWaiting,
          });
        },
      });
    },
    methods: {
      async authorization() {
        uni.showWaiting({});

        const { encryptedData, iv } = await (uni.getUserProfile({
            desc: "Improve basic information",
          }) as unknown as Promise<UniApp.GetUserProfileRes>),
          { code } = await (uni.login({}) as unknown as Promise<UniApp.LoginRes>);

        uni.request({
          url: path.setUserInfo,
          data: {
            code,
            encryptedData,
            iv,
          },
          success: ({ data }: any) => {
            uni.setStorage({
              key: "userInfo",
              data: { value: data.userInfo, validityDay },
            });
            uni.reLaunch({
              url: page.home,
              complete: uni.hideWaiting,
            });
          },
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .root {
    .logo {
      display: block;
      margin: 90rpx auto;
      width: 200rpx;
      height: 200rpx;
    }

    .content {
      display: flex;
      flex-direction: column;
      border-top: 1px solid #ccc;
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
