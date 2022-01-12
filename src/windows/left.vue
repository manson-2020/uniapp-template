<template>
  <view class="root">{{ title }}</view>
</template>

<script lang="ts" setup>
  import { onLoad } from "@dcloudio/uni-app";
  import { ref } from "vue";

  const title = ref("left");
  onLoad(() => {});
</script>

<style lang="scss" scoped>
  // scss
</style>