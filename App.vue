<script lang="ts">
	import Vue from "vue";
	import { Storage } from "./static/libs/utils";
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
				// #ifndef MP
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
				const { checkVersion: checkVersionURL } = this.$config.path;
				if (!checkVersionURL) return;
				const { data, msg: title } = await this.$request.get(checkVersionURL, {
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
