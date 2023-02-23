<template>
  <view
    style="width: 740rpx; border-radius: 25px;  background-color: rgba(0, 0, 0, 0.1);  box-shadow: 0 0 18rpx #333; padding: 30rpx;">
    <image class="width-120 height-120 as-center" src="/static/logo.png" mode="aspectFit" />

    <text class="mt-60 color-title fs-36 fw-600 lh-100">系统注册</text>

    <view :style="{ padding: `30rpx`, borderTop: `2rpx #ececec solid` }">
      <label>
        <uni-icons class="mr-30" type="person-filled" size="18" color="#fff" />
        <uni-easyinput class="f1 height-66" type="number" placeholder="手机号/邮箱" />
      </label>
      <view class="fd-row ai-center mt-44">
        <uni-icons class="mr-30" type="locked-filled" size="18" color="#fff" />
        <uni-easyinput class="f1 height-66" maxlength="6" type="number" placeholder="验证码" />
        <button hover-class="tap-hover" hover-start-time="50" :disabled="captchaBtn.disabled" @click="sendCaptcha"
          :plain="true" class="fs-24 ml-12 border-none bgc-btn color-inverse">
          {{ captchaBtn.text }}
        </button>
      </view>
      <label class="mt-44">
        <uni-icons class="mr-30" type="locked-filled" size="18" color="#fff" />
        <uni-easyinput class="f1 height-66" type="password" placeholder="密码" />
      </label>
      <label class="mt-44">
        <uni-icons class="mr-30" type="locked-filled" size="18" color="#fff" />
        <uni-easyinput class="f1 height-66" type="password" placeholder="确认密码" />
      </label>

      <view class="fd-row">
        <button type="primary" class="border-none f1 bgc-2 mt-90 fs-32 lh-66 color-inverse" hover-class="tap-hover">
          注册
        </button>
        <button :plain="true" :style="{ border: `1px solid #dcdfe6` }" class="ml-20 f1 mt-90 fs-32 lh-66 color-inverse"
          hover-class="tap-hover" @click="goBack">
          返回
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { reactive, Ref, ref } from "vue";
export default {
  onLoad() { },
  setup() {
    const captchaBtn = reactive({
      text: "发送",
      disabled: false,
      count: 10,
    });

    const timer: Ref<null | NodeJS.Timer> = ref(null);

    const countDown = () => {
      captchaBtn.disabled = true;
      const startTiming = () => {
        captchaBtn.count--;
        captchaBtn.text = `请${captchaBtn.count}秒后再试`;
        if (captchaBtn.count <= 0) {
          captchaBtn.disabled = false;
          captchaBtn.text = "重新发送";
          captchaBtn.count = 10;
          timer.value && clearInterval(timer.value);
          timer.value = null;
        }
        return startTiming;
      }
      timer.value = setInterval(startTiming(), 1000);
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
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>