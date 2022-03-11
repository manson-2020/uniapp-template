<template>
  <view class="root">{{ title }}</view>
</template>

<script lang="ts" setup>
  import { onLoad, onShow } from "@dcloudio/uni-app";
  import { ref } from "vue";

  const title = ref("home");
  onLoad(() => {});

  onShow(() => {});
</script>

<style lang="scss" scoped>
  // scss
</style>