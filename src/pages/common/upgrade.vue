<template>
  <view class="mask">
    <view class="content">
      <view class="content-header">
        <text class="content-top-text">{{ upgradeInfo.title }}</text>
        <image class="content-header-image" style="top: 0;" src="/static/img/bg-upgrade.png" />
      </view>
      <view class="content-body">
        <view class="body">
          <scroll-view class="box-des-scroll" scroll-y>
            <text class="box-des" user-select selectable decode space="nbsp">
              {{ upgradeInfo.description }}
            </text>
          </scroll-view>
        </view>
        <button @click="download" class="content-button">
          立即下载
        </button>
      </view>
    </view>

    <uni-icons v-if="!upgradeInfo.forceUpdate" @click="close" class="close" type="close" size="66" color="#fff" />
  </view>
</template>

<script lang="ts" setup>
import { onBackPress, onLoad, onUnload } from '@dcloudio/uni-app';
import { reactive } from 'vue';

const upgradeInfo = reactive<any>({});

const close = uni.navigateBack;

onLoad(() => uni.getStorage({
  key: "upgradeInfo",
  success(data) {
    Object.assign(upgradeInfo, data);
  },
  fail: close,
}));

onBackPress(() => Boolean(upgradeInfo.forceUpdate));

onUnload(() => uni.removeStorage({ key: "upgradeInfo" }));

const download = () => {
  // Android market://details?id=packageName
  // Apple https://apps.apple.com/cn/app/id0123456789
  // #ifdef APP-PLUS
  plus.runtime.openURL(upgradeInfo.upgradeURL);
  // #endif
  // #ifdef H5
  location.href = upgradeInfo.upgradeURL;
  // #endif
}

</script>

<style>
page {
  background: transparent;
}

.mask {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  justify-content: center;
  align-items: center;

  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .65);
}

.content {
  position: relative;
  top: 0;
  width: 600rpx;
  background-color: #fff;
  box-sizing: border-box;
  font-family: Source Han Sans CN;
  border-bottom-left-radius: 30rpx;
  border-bottom-right-radius: 30rpx;
}

.content-header {
  position: absolute;
  top: -195rpx;
  left: 0;
  width: 100%;
  height: 270rpx;
}

.content-header-text {
  font-size: 45rpx;
  font-weight: bold;
  color: #f8f8fa;
  position: absolute;
  top: 120rpx;
  left: 50rpx;
  z-index: 1;
}

.content-header-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.content-body {
  margin: 70rpx 50rpx 30rpx;
}

.box-des-scroll {
  box-sizing: border-box;
  padding: 0 40rpx;
  height: 200rpx;
  text-align: left;
}

.box-des {
  font-size: 26rpx;
  color: #000;
  line-height: 50rpx;
  word-break: break-all;
}

.close {
  margin-top: 50rpx;
}

.content-button {
  text-align: center;
  flex: 1;
  font-size: 28rpx;
  font-weight: 400;
  color: #fff;
  border-radius: 40rpx;
  margin: 6rpx 18rpx 0;
  height: 80rpx;
  line-height: 80rpx;
  background-image: linear-gradient(to right, #1785ff, #3da7ff);
}
</style>
