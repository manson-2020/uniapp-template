<template>
  <view class="root">
    <button @click="logout" type="primary" class="mt-100 fs-30 lh-2">
      logout
    </button>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import $config from "../../static/config";

export default defineComponent({
  onLoad() { },
  methods: {
    logout() {
      uni.reLaunch({
        url: $config.page.auth,
        success: uni.clearStorage,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
// scss
</style>