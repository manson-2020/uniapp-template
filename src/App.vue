<script lang="ts">
    import Vue from "vue";
    import { Storage } from "@/libs/utils";
    export default Vue.extend({
        mpType: "app",
        onLaunch() {},
        onHide() {
            console.log("App Hide");
        },
        onPageNotFound() {
            uni.redirectTo({ url: "/pages/notFound" });
        },
    });
</script>

<style lang="scss">
    @import "./common/reset.scss";

    .tap-hover {
        opacity: 0.6;
    }

    .input {
        border: none;
        outline: none;
        background-color: transparent;
    }

    .avatar {
        background-color: #eee;
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
</style>
