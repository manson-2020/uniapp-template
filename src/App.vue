<script lang="ts">
import { defineComponent } from "vue";
import $config from "./common/config";
import { connectWebsocket, setConfig } from "./common/libs/dependency";

export default defineComponent<{ globalData: typeof $config }>({
  globalData: { $config },
  onLaunch() {
    // uni.setLocale("zh");
    connectWebsocket();
    setConfig();
  },
  onPageNotFound({ path }: App.PageNotFoundOption) {

    path !== "/" && uni.redirectTo({ url: this.globalData.$config.PAGE_ERROR });
  },
  onThemeChange({ theme }: { theme: "light" | "dark" }) {
    plus.nativeUI.setUIStyle(theme);
    this.$store.commit("setTheme", theme);
  },
});
</script>

<style lang="scss">
@import "@/common/style/reset.scss";
@import "@/common/style/common.scss";
@import "@/common/style/theme.scss";
</style>
