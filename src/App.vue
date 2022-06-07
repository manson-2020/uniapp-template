<script lang="ts">
import { defineComponent } from "vue";
import $config from "./static/config";
import {
  checkVersion,
  openWebsocket,
  setConfig,
} from "./static/libs/dependency";

export default defineComponent({
  globalData: { $config },
  onLaunch() {
    // uni.setLocale("en");
    $config.path.checkVersion && checkVersion();
    $config.SOCKET_URL && openWebsocket();
    $config.path.setConfig && setConfig();
  },
  onPageNotFound() {
    uni.redirectTo({ url: $config.page.error });
  },
  onThemeChange({ theme }: { theme: "light" | "dark" }) {
    plus.nativeUI.setUIStyle(theme);
    this.$store.commit("setTheme", theme);
  },
});
</script>

<style lang="scss">
@import "./static/style/reset.scss";
@import "./static/style/common.scss";
@import "./static/style/theme.scss";
</style>
