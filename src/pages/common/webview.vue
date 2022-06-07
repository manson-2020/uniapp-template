<template>
  <web-view class="f1" :webview-styles="webviewStyles" :src="url" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data: () => ({
    url: "",
    webviewStyles: {
      progress: {
        color: "#1ba0ff",
      },
    },
  }),
  onLoad({ url = "https://m.baidu.com" }) {
    this.url = decodeURIComponent(url);
  },
});
</script>