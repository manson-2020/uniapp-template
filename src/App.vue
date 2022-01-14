<script setup lang="ts">
  import { onLaunch, onShow, onHide, onPageNotFound } from "@dcloudio/uni-app";
  import $config from "./static/libs/config";

  onLaunch(() => {
    // uni.setStorage({ key: "authInfo", data: { token: "asd" } });
    checkVersion();
    if ($config.SOCKET_URL) openWebsocket();

    console.log(
      `%c uni Admin %c 当前版本号 v${0.1} %c`,
      "background: #35495e; padding: 1px; border-radius: 3px 0 0 3px; color: #fff",
      "background: #007aff; padding: 1px; margin: 1px; border-radius: 0 3px 3px 0; color: #fff; font-weight: bold;",
      "background: transparent"
    );
  });

  onShow(() => {
    console.log("App Show");
  });

  onHide(() => {
    console.log("App Hide");
  });

  onPageNotFound(() => {
    uni.redirectTo({ url: $config.page.error });
  });

  async function checkVersion() {
    // #ifdef MP
    const { onCheckForUpdate, onUpdateReady, onUpdateFailed, applyUpdate } =
      uni.getUpdateManager();

    onCheckForUpdate(({ hasUpdate }) => {
      /* 请求完新版本信息的回调 */
      hasUpdate && uni.clearStorage();
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
    const { data, msg: title }: any = await uni.request({
      url: checkVersionURL,
      data: {
        platform: uni.getSystemInfoSync().platform,
        version: plus.runtime.version,
      },
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
  }

  function openWebsocket() {
    let [socketOpen, socketMsgQueue]: [boolean, string[]] = [false, []];

    uni.connectSocket({ url: $config.SOCKET_URL });
    uni.onSocketOpen((res) => {
      socketOpen = true;
      for (let i = 0; i < socketMsgQueue.length; i++) {
        socketOpen
          ? uni.sendSocketMessage({ data: socketMsgQueue[i] })
          : socketMsgQueue.push(socketMsgQueue[i]);
      }
      socketMsgQueue = [];
      // uni.closeSocket({});
    });
    uni.onSocketMessage((res) => {
      console.log("Received server content:" + res.data);
    });
    uni.onSocketClose((res) => {
      socketOpen = false;
      console.log("Websocket closed!");
    });
    uni.onSocketError((res) => {
      console.log("Websocket connection opening failed, please check!");
    });
  }
</script>

<style lang="scss">
  // 公共颜色类
  page,
  view,
  picker,
  button,
  label,
  swiper-item,
  scroll-view,
  cover-view,
  navigator,
  radio-group,
  checkbox-group {
    // #ifndef APP-PLUS-NVUE
    display: flex;
    flex-direction: column;
    // #endif
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .uni-app--showleftwindow uni-main {
    position: relative;
  }

  .uni-app--showleftwindow uni-page-wrapper {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    padding: 15px;
    overflow-y: auto;
    box-sizing: border-box;
    background-color: #f5f5f5;
  }

  .uni-app--showleftwindow uni-page-body {
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    box-shadow: -1px -1px 5px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }

  page {
    font-weight: 500;
    height: 100%;
    background-color: #fcfcfc;
  }

  label {
    flex-direction: row;
    align-items: center;
  }

  scroll-view {
    width: auto;
  }

  picker[disabled],
  button[disabled] {
    opacity: 0.5;
  }

  ::selection {
    background: #26a69a;
    color: #ffffff;
    font-weight: 900;
    font-size: 32px;
  }

  ::-webkit-scrollbar {
    width: 9px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgb(204, 204, 204, 0.6);
    background-color: rgb(204, 204, 204, 0.6);
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgb(204, 204, 204, 0.6);
    border-radius: 0;
    background-color: rgb(204, 204, 204, 0.1);
  }

  @each $color
    in (
      #606266,
      #007aff,
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
      color: $color !important;
    }
  }

  @each $bgc
    in (
      #f56c6c,
      #409eff,
      #f0f0f0,
      #f9f9f9,
      #dfdfdf,
      #f5f5f5,
      #eee,
      #fff,
      #ccc,
      transparent
    )
  {
    @if $bgc == transparent {
      .bgc-#{$bgc} {
        background-color: $bgc !important;
      }
    } @else {
      .bgc-#{str-slice("#{$bgc}", 2)} {
        background-color: $bgc !important;
      }
    }
  }

  @import "./static/common.scss";
</style>
