<script setup lang="ts">
  import { onLaunch, onPageNotFound } from "@dcloudio/uni-app";
  import $config from "./static/config";
  import { checkVersion, openWebsocket } from "./static/libs/dependency";

  onLaunch(() => {
    checkVersion();
    if ($config.SOCKET_URL) openWebsocket();
  });

  onPageNotFound(() => {
    uni.redirectTo({ url: $config.page.error });
  });
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
    background: #409eff;
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
      .bgc-transparent {
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
