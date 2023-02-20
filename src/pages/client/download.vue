<template>
  <view class="box">
    <swiper autoplay circular class="swiper">
      <swiper-item v-for="src in list" :key="src">
        <u-image width="100%" height="100%" :src="src" mode="widthFix" />
      </swiper-item>
    </swiper>
    <view class="content">
      <u-image fit="contain" width="120" height="120" radius="12" src="/static/logo.png" />
      <text class="description">一款百货消费商城</text>
      <uni-button class="button" :disabled="buttonDisabled" :loading="buttonLoading" @click="download" ripple plain>
        {{ buttonText }}
      </uni-button>
    </view>

    <uni-popup v-model="showPopup" mode="center">
      <l-painter ref="painterRef" css="width: 390rpx; height: 390rpx;" isCanvasToTempFilePath>
        <l-painter-view
          css="position: relative; background-color: #fff;  width: 100%; height: 100%; border-radius: 12rpx;">
          <l-painter-qrcode css="position: absolute; width: 360rpx; height: 360rpx; left: 15rpx; top: 15rpx;"
            :text="qrcodeText" />
        </l-painter-view>
      </l-painter>
    </uni-popup>

    <uni-popup :show="showMask" :zoom="false">
      <u-image width="100%" src="/static/mask.png" mode="widthFix" />
    </uni-popup>
  </view>
</template>

<script>
import { baseURL, basePath } from '@/config/app';
import { checkVersion } from '@/utils/tools';

function getEnv() {
  const { osName, uniPlatform } = uni.getSystemInfoSync();

  if (uniPlatform === "web") {
    if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
      return osName === "ios" ? 1 : 2;
    }
    return osName === "ios" ? 3 : 4;
  }

  if (uniPlatform === "app") {
    return osName === "ios" ? 5 : 6;
  }

  return osName === "ios" ? 7 : 8;
}

export default {
  components: {
    lPainter,
    lPainterView,
    lPainterQrcode
  },
  data() {
    return {
      showPopup: false,
      showMask: false,
      scan: false,
      env: getEnv(),
      list: [
        "/static/share1.png",
        "/static/share2.png",
        "/static/share3.png",
        "/static/share4.png",
      ],
      qrcodeText: `${baseURL}${basePath}/bundle/pages/download/download?scan=1`,
      buttonDisabled: false,
      buttonText: "",
      buttonLoading: false
    };
  },
  onLoad({ scan }) {
    switch (this.env) {
      case 1:
      case 3:
      case 7:
        this.buttonDisabled = true;
        this.buttonText = "iOS端暂不支持下载";
        break;
      case 5:
      case 6:
        this.buttonText = "查看下载二维码";
        break;
      default:
        this.buttonText = "立即下载";
        break;
    }

    !!+scan && this.download();
  },
  methods: {
    download() {
      switch (this.env) {
        case 1:
        case 2:
          this.buttonDisabled = true;
          this.showMask = true;
          return;
        case 5:
        case 6:
          this.showPopup = true;
          return;
        case 3:
        case 7:
          uni.showToast({ title: "iOS暂不支持", icon: "none" });
          return;
        default:
          this.buttonDisabled = true;
          this.buttonLoading = true;
          this.buttonText = "正在下载...";
          checkVersion({ showToast: true });
          return;
      }
    }
  }
};
</script>

<style>
page {
  height: 100%;
}

.box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.swiper {
  width: 100%;
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: -60rpx;
  right: -60rpx;
  padding: 50rpx 15px 60rpx;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(6px);
  box-shadow: 0 0 5px #d7d0ff;
  border-radius: 50% 50% 0 0;
}

.description {
  margin-top: 24px;
  color: #555;
  font-size: 16px;
  font-weight: 500;
}

.button {
  margin-top: 24px;
  border-radius: 30px;
  width: 260px;
  color: #fff !important;
  border: none !important;
  background-image: linear-gradient(to bottom, #d7d0ff, #9f92f1);
}
</style>