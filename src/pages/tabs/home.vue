<template>
  <view class="root">{{ title }}</view>
</template>

<script setup lang="ts">
  import { onLoad } from "@dcloudio/uni-app";
  import { ref } from "vue";

  const title = ref("home");
  onLoad(() => {});
</script>

<style lang="scss" scoped>
  // scss
</style>