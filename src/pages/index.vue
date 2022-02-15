<template></template>

<script>
  import $config from "../static/config";

  export default {
    async onLoad() {
      uni.showLoading({ title: "Loading...", mask: true });
      uni.getStorage({
        key: $config.authInfoStorageKey,
        success: () => uni.reLaunch({ url: $config.page.clientHome }),
        complete: uni.hideLoading,
      });
    },
  };
</script>