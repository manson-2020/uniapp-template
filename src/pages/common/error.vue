<template>
  <view class="root">
    <text class="oops">Oops!</text>
    <text class="headline">
      The webmaster said that you can not enter this page...
    </text>
    <text class="info">
      Please check that the URL you entered is correct, or click the button
      below to return to the homepage.
    </text>
    <navigator
      open-type="reLaunch"
      :url="$config.page.home[0]"
      hover-class="hover"
      hover-stay-time="50"
      class="return-home"
    >
      Return to homepage...
    </navigator>
  </view>
</template>

<script lang="ts" setup>
  import $config from "../../static/config";
</script>

<style lang="scss" scoped>
  .root {
    height: 100vh;
    justify-content: center;
    max-width: 1200px;
    margin: auto;
    padding: 30px 60rpx 90px;
  }
  @keyframes slideUp {
    from {
      transform: translateY(60px);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .oops,
  .headline,
  .info,
  .return-home {
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    opacity: 0;
  }
  .oops {
    font-size: 32px;
    line-height: 40px;
    color: #1482f0;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .headline {
    font-size: 20px;
    line-height: 24px;
    color: #222;
    margin-bottom: 10px;
    animation-delay: 0.1s;
    font-weight: bold;
  }
  .info {
    font-size: 13px;
    line-height: 21px;
    color: #888;
    margin-bottom: 30px;
    animation-delay: 0.2s;
  }
  .return-home {
    width: fit-content;
    padding: 8px 12px;
    background-color: #1482f0;
    border-radius: 18px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    animation-delay: 0.3s;
    &.hover,
    &:hover {
      filter: opacity(0.6);
    }
  }
</style>