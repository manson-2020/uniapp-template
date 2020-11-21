<template>
    <view class="root">
        <text class="oops">OOPS!</text>
        <text class="headline">
            The webmaster said that you can not enter this page...
        </text>
        <text class="info">
            Please check that the URL you entered is correct, or click the
            button below to return to the homepage.
        </text>
        <navigator
            :open-type="openType"
            :url="home"
            hover-class="tap-hover"
            hover-stay-time="100"
            class="return-home"
        >
            Come back home
        </navigator>
    </view>
</template>

<script>
    import Vue from "vue";
    import { page } from "@/common/config";

    export default Vue.extend({
        data: () => ({ url: page.home, openType: "navigate" }),
    });
</script>

<style lang="scss" scoped>
    page,
    .root {
        height: 100%;
    }

    .root {
        justify-content: center;
        max-width: 1200px;
        margin: auto;
        padding: 30px 60rpx 90px;
    }
    @keyframes slideUp {
        from {
            transform: translateY(60px);
            opacity: 0;
        }

        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    .oops,
    .headline,
    .info,
    .return-home {
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        opacity: 0;
    }
    .oops {
        font-size: 32px;
        line-height: 40px;
        color: #1482f0;
        font-weight: bold;
        margin-bottom: 20px;
    }
    .headline {
        font-size: 20px;
        line-height: 24px;
        color: #222;
        margin-bottom: 10px;
        animation-delay: 0.1s;
        font-weight: bold;
    }
    .info {
        font-size: 13px;
        line-height: 21px;
        color: #888;
        margin-bottom: 30px;
        animation-delay: 0.2s;
    }
    .return-home {
        width: fit-content;
        width: -moz-fit-content;
        padding: 8px;
        background-color: #1482f0;
        border-radius: 100px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        animation-delay: 0.3s;
        &.hover,
        &:hover {
            filter: opacity(0.6);
        }
    }
</style>