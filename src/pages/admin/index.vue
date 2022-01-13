<template>
  <view class="root" :style="{ padding: `30px` }">{{ title }}</view>
</template>

<script lang="ts" setup>
  import { onLoad } from "@dcloudio/uni-app";
  import { ref } from "vue";

  const title = ref("index");
  onLoad(() => {
    // uni.showLoading({title: "asd"})
  });
</script>

<style lang="scss" scoped>
  // scss
</style>