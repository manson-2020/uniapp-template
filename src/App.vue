<script setup lang="ts">
  import { onLaunch, onShow, onHide, onPageNotFound } from "@dcloudio/uni-app";
  import { Storage } from "./static/libs/utils";
  import { $config, $request } from "./static";

  const checkVersion = async () => {
    // #ifdef MP
    const { onCheckForUpdate, onUpdateReady, onUpdateFailed, applyUpdate } =
      uni.getUpdateManager();

    onCheckForUpdate(({ hasUpdate }) => {
      /* 请求完新版本信息的回调 */
      hasUpdate && Storage.clear();
    });

    onUpdateReady((res) => {
      uni.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        success: ({ confirm }) => confirm && applyUpdate(),
      });
    });

    onUpdateFailed((res) => {
      // 新的版本下载失败
      uni.showToast({
        title: "新版本下载失败，请稍后再试。",
        icon: "none",
      });
    });
    // #endif

    // #ifdef APP-PLUS
    const { checkVersion: checkVersionURL } = $config.path;
    if (!checkVersionURL) return;
    const { data, msg: title } = await $request.get(checkVersionURL, {
      platform: uni.getSystemInfoSync().platform,
      version: plus.runtime.version,
    });

    if (!data.upgradeUrl) return;

    const [showModalFail, showModalRes]: any = await uni.showModal({
      title,
      content: data.description,
      showCancel: Boolean(+data.forceUpdate),
    });

    if (showModalFail || !showModalRes.cancel) return;

    if (uni.getSystemInfoSync().platform == "ios") {
      plus.runtime.openURL(data.upgradeUrl);
      return;
    }

    const showLoading = plus.nativeUI.showWaiting("开始下载...");

    const downloadTask = uni.downloadFile({
      url: data.upgradeUrl,
      success: ({ tempFilePath }) => {
        showLoading.setTitle("正在安装...");

        plus.runtime.install(
          <any>tempFilePath,
          {},
          (e) => {
            plus.nativeUI.closeWaiting();
            uni.showModal({
              title: "更新完成",
              content: "新版本需要重启APP",
              confirmText: "立即重启",
              showCancel: false,
              success: plus.runtime.restart,
            });
          },
          (error) => {
            plus.nativeUI.closeWaiting();
            uni.showToast({ title: "安装失败", icon: "none" });
          }
        );
      },
      fail() {
        uni.showToast({ title: "下载失败", icon: "none" });
      },
    });

    downloadTask.onProgressUpdate(
      ({ progress, totalBytesWritten, totalBytesExpectedToWrite }) =>
        showLoading.setTitle(
          `正在下载(${(totalBytesWritten / 1024 ** 2).toFixed(2)}MB/${(
            totalBytesExpectedToWrite /
            1024 ** 2
          ).toFixed(2)}MB)	${progress}%`
        )
    );
    // #endif
  };

  onLaunch(() => {
    checkVersion();

    Storage.set("authInfo", { token: "asdasdsad" }, 15);
  });

  onShow(() => {
    console.log("App Show");
  });

  onHide(() => {
    console.log("App Hide");
  });

  onPageNotFound(() => {
    uni.redirectTo({ url: "/pages/common/notFound" });
  });
</script>

<style lang="scss">
  // 公共颜色类
  @each $color
    in (
      #1b1b1b,
      #1c9dff,
      #2e54fd,
      #4052e4,
      #f21919,
      #f33,
      #808080,
      #ccc,
      #ddd,
      #fff,
      #333,
      #222,
      #666,
      #aaa,
      #eee,
      #888,
      #999
    )
  {
    .color-#{str-slice("#{$color}", 2)} {
      color: $color;
    }
  }

  @each $bgc
    in (
      #4672ff,
      #f0f0f0,
      #2e54fd,
      #f9f9f9,
      #dfdfdf,
      #f5f5f5,
      #eee,
      #fff,
      #ccc,
      transparent
    )
  {
    .bgc-#{str-slice("#{$bgc}", 2)} {
      background-color: $bgc;
    }
  }
  @import "./static/common.scss";
</style>
