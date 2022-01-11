<template></template>

<script setup lang="ts">
  import { $config } from "../static";
  import { Storage } from "../static/libs/utils";
  import { onLoad } from "@dcloudio/uni-app";

  onLoad(() => {
    uni.showLoading({ title: "Loading...", mask: true });
    uni.reLaunch({
      url: $config.page[Storage.get("authInfo")?.token ? "home" : "auth"],
      complete: uni.hideLoading,
    });
  });
</script>