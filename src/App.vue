<script lang="ts">
    import Vue from "vue";
    import { Storage } from "@/libs/utils";
    export default Vue.extend({
        mpType: "app",
        onLaunch() {
            // #ifdef H5
            this.testData();
            //  #endif

            // #ifndef H5 || APP-PLUS
            this.checkVersion();
            // #endif
        },
        onPageNotFound() {
            uni.redirectTo({ url: "/pages/notFound" });
        },

        methods: {
            checkVersion() {
                const {
                    onCheckForUpdate,
                    onUpdateReady,
                    onUpdateFailed,
                    applyUpdate,
                } = uni.getUpdateManager();

                onCheckForUpdate((res) => {
                    /* 请求完新版本信息的回调 */
                });

                onUpdateReady((res) => {
                    uni.showModal({
                        title: "更新提示",
                        content: "新版本已经准备好，是否重启应用？",
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        success: (res) => res.confirm && applyUpdate(),
                    });
                });

                onUpdateFailed((res) => {
                    // 新的版本下载失败
                    uni.showToast({
                        title: "新版本下载失败，请稍后再试。",
                        icon: "none",
                    });
                });
            },

            testData() {
                Storage.set("userInfo", {
                    user_id: 25,
                    phoneNumber: "18011302638",
                    avatarUrl:
                        "https://thirdwx.qlogo.cn/mmopen/vi_32/sib4rBfv4rrKzVeOS0098icduicGSDdmcdcgkAurAkqnn1nKib921lHKIKOsccS97sT2GhZ8IQ5CwvPib1TTria4FuUw/132",
                    nickName: "manson",
                    identity: 0,
                    balance: "8364.43",
                    // token: "McjxVpfhMpTYwNjg4NDk2MgO0O0OO0O0O",
                    token: "McjxZpfhMpTYwNTgzOTA2NwO0O0OO0O0O",
                    coupon: 170,
                });
            },
        },
    });
</script>

<style lang="scss">
    @import "./common/reset.scss";

    @each $color
        in (
            #9a9a9a,
            #0d81f6,
            #4d4d4d,
            #ccc,
            #ddd,
            #fff,
            #333,
            #666,
            #aaa,
            #eee,
            #999
        )
    {
        .color-#{str-slice("#{$color}", 2)} {
            color: $color;
        }
    }

    @each $bgc in (#c8c7cc, #0d81f6, transparent, #eee, #fff, #ccc) {
        .bgc-#{str-slice("#{$bgc}", 2)} {
            background-color: $bgc;
        }
    }

    .tap-hover {
        opacity: 0.6;
    }

    .input {
        border: none;
        outline: none;
        background-color: transparent;
    }

    .status-bar {
        height: var(--status-bar-height);
    }

    .shelter {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(51, 51, 51, 0.3);
    }

    .oh {
        overflow: hidden;
    }

    .word-break-all {
        word-break: break-all;
    }

    .ellipsis {
        display: inline-block;
        overflow: hidden;
        min-width: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .multi-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }
</style>
