<template>
  <view class="root">{{ title }}</view>
</template>

<script lang="ts" setup>
  import { onLoad } from "@dcloudio/uni-app";
  import { ref } from "vue";

  const title = ref("home");
  onLoad(() => {
    uni.request({
      url: "/chePhone",
      data: { phoneNum: "13786310544" },
      success: (res) => {
        console.log(res);
      },
    });
  });
</script>

<style lang="scss" scoped>
  // scss
</style>