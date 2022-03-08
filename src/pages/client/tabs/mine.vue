<template>
  <view class="root">
    <button @click="logout" type="primary" class="mt-100 fs-30 lh-2">
      logout
    </button>
  </view>
</template>

<script lang="ts">
  const { $config } = getApp().globalData as any;

  export default {
    methods: {
      logout() {
        uni.clearStorage();
        uni.reLaunch({ url: $config.page.login });
      },
    },
  };
</script>

<style lang="scss" scoped>
  // scss
</style>