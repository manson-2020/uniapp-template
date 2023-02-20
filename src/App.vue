<script lang="ts">
import { defineComponent } from "vue";
import $config from "./static/config";
import { connectWebsocket, setConfig } from "./static/libs/dependency";

export default defineComponent({
  globalData: { $config },
  onLaunch() {
    // uni.setLocale("zh");
    connectWebsocket();
    setConfig();
  },
  onPageNotFound({ path }: { path: string }) {
    path === "/" || uni.redirectTo({ url: $config.PAGE_ERROR });
  },
  onThemeChange({ theme }: { theme: "light" | "dark" }) {
    plus.nativeUI.setUIStyle(theme);
    this.$store.commit("setTheme", theme);
  },
});
</script>

<style lang="scss">
@import "@/static/style/reset.scss";
@import "@/static/style/common.scss";
@import "@/static/style/theme.scss";
</style>
