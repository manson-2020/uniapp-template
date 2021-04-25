<script lang="ts">
	import Vue from "vue";
	import { Storage } from "./libs/utils";
	export default Vue.extend({
		mpType: "app",
		globalData: {},
		onLaunch() {
			// #ifndef H5
			this.checkVersion();
			// #endif
		},
		onPageNotFound() {
			uni.redirectTo({ url: "/pages/common/notFound" });
		},

		methods: {
			async checkVersion() {
				// #ifndef APP-PLUS
				const {
					onCheckForUpdate,
					onUpdateReady,
					onUpdateFailed,
					applyUpdate,
				} = uni.getUpdateManager();

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
			},
		},
	});
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		font-weight: 500;
		height: 100%;
		background-color: #f7f7f7;
	}
</style>