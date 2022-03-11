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
        <uni-easyinput class="f1" type="number" placeholder="手机号/邮箱" />
      </label>
      <view class="fd-row ai-center mt-44">
        <uni-icons
          class="mr-30"
          type="locked-filled"
          size="18"
          color="#606266"
        />
        <uni-easyinput
          class="f1"
          maxlength="6"
          type="number"
          placeholder="验证码"
        />
        <button
          hover-class="tap-hover"
          hover-start-time="50"
          :disabled="captchaBtn.disabled"
          @click="sendCaptcha"
          :plain="true"
          class="fs-24 ml-12 border-none color-007aff"
        >
          {{ captchaBtn.text }}
        </button>
      </view>
      <label class="mt-44">
        <uni-icons
          class="mr-30"
          type="locked-filled"
          size="18"
          color="#606266"
        />
        <uni-easyinput class="f1" type="password" placeholder="密码" />
      </label>
      <label class="mt-44">
        <uni-icons
          class="mr-30"
          type="locked-filled"
          size="18"
          color="#606266"
        />
        <uni-easyinput class="f1" type="password" placeholder="确认密码" />
      </label>

      <view class="fd-row">
        <button
          type="primary"
          class="border-none f1 bgc-409eff mt-90 lh-60 fs-28 color-fff"
          hover-class="tap-hover"
        >
          注册
        </button>
        <button
          :plain="true"
          :style="{ border: `1px solid #dcdfe6` }"
          class="ml-20 f1 mt-90 lh-60 fs-28 color-606266"
          hover-class="tap-hover"
          @click="goBack"
        >
          返回
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
  import { reactive, Ref, ref } from "vue";
  export default {
    onLoad() {},
    setup() {
      const captchaBtn = reactive({
        text: "Send",
        disabled: false,
        count: 10,
      });

      const timer: Ref<null | NodeJS.Timer> = ref(null);

      const countDown = () => {
        captchaBtn.disabled = true;
        timer.value = setInterval(() => {
          captchaBtn.count--;
          captchaBtn.text = `After ${captchaBtn.count} second retry`;
          if (captchaBtn.count <= 0) {
            captchaBtn.disabled = false;
            captchaBtn.text = "Resend";
            captchaBtn.count = 10;
            timer.value && clearInterval(timer.value);
            timer.value = null;
          }
        }, 1000);
      };

      const sendCaptcha = countDown;

      return { captchaBtn, sendCaptcha };
    },
    methods: {
      goBack() {
        uni.navigateBack({});
      },
    },
  };
</script>

<style lang="scss" scoped>
  // scss
  page {
    max-width: 840rpx;
    margin: auto;
  }
</style>