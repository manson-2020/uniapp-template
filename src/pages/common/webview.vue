<template>
  <web-view @message="onMessage" class="f1" :webview-styles="webviewStyles" :update-title="Boolean(pageTitle)"
    :src="src" />
</template>

<script lang="ts" setup>
import { onLoad, onShareAppMessage } from "@dcloudio/uni-app";
import { ref } from "vue";

const webviewStyles = {
  progress: {
    color: "#1ba0ff",
  },
};

const pageTitle = ref<string>(""),
  src = ref<string>("");

onLoad(({ url = "", title = "" }: any) => {
  src.value = decodeURIComponent(url);
  if (title) {
    pageTitle.value = title;
    uni.setNavigationBarTitle({ title });
  }
});

onShareAppMessage(({ webViewUrl }) => ({
  title: pageTitle.value,
  path: `/pages/common/webview?url=${webViewUrl}`
}));

const onMessage = (e: any) => {
  console.log(e);
}

</script>