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

<style lang="scss">
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

	// 公共类
	@for $flex from 1 through 5 {
		.f#{$flex} {
			flex: $flex;
		}
	}

	@each $fd, $value in (col: column, row: row, rerow: row-reverse, recol: column-reverse) {
		.fd-#{$fd} {
			flex-direction: $value;
		}
	}

	@each $align, $value in (start: flex-start, center: center, end: flex-end, baseline: baseline) {
		.ai-#{$align} {
			align-items: $value;
		}
		.as-#{$align} {
			align-self: $value;
		}
		.ac-#{$align} {
			align-content: $value;
		}
	}

	@each $justify,
		$value
			in (
				sa: space-around,
				sb: space-between,
				se: space-evenly,
				center: center,
				start: flex-start,
				end: flex-end
			)
	{
		.jc-#{$justify} {
			justify-content: $value;
		}
		.js-#{$justify} {
			justify-self: $value;
		}
		.ji-#{$justify} {
			justify-items: $value;
		}
	}

	@each $position in (fixed, relative, absolute, static) {
		.#{$position} {
			position: $position;
		}
	}

	@each $text in (center, left, right, justify) {
		.text-#{$text} {
			text-align: $text;
		}
	}

	@for $i from 0 through 50 {
		@each $wrapper,
			$box
				in (
					top: top,
					bottom: bottom,
					left: left,
					right: right,
					width: width,
					height: height,
					mt: margin-top,
					mr: margin-right,
					mb: margin-bottom,
					ml: margin-left,
					pt: padding-top,
					pr: padding-right,
					pb: padding-bottom,
					pl: padding-left,
					fs: font-size
				)
		{
			.#{$wrapper}-#{$i * 2} {
				#{$box}: #{$i * 2}rpx;
			}
		}

		@if $i < 30 {
			.br-#{$i * 2} {
				border-radius: #{$i * 2}rpx;
			}
		}

		@if $i <= 5 {
			.lh-#{$i} {
				line-height: $i;
			}
		} @else {
			.lh-#{$i * 2} {
				line-height: #{$i * 2}rpx;
			}
		}
	}

	@each $size in (auto, 20, 25, 30, 50, 70, 100) {
		@if $size == 50 {
			.br-circle {
				border-radius: 50%;
			}
		}
		@if $size == auto {
			.width-#{$size} {
				width: $size;
			}
			.height-#{$size} {
				height: $size;
			}
		} @else {
			.width-#{$size}vw {
				width: #{$size}vw;
			}
			.width-#{$size}percent {
				width: #{$size}#{"%"};
			}

			.height-#{$size}vh {
				height: #{$size}vh;
			}
			.height-#{$size}percent {
				height: #{$size}#{"%"};
			}

			.top-#{$size}percent {
				top: #{$size}#{"%"};
			}
			.left-#{$size}percent {
				left: #{$size}#{"%"};
			}
			.bottom-#{$size}percent {
				bottom: #{$size}#{"%"};
			}
			.right-#{$size}percent {
				right: #{$size}#{"%"};
			}
		}
	}

	@for $i from 1 to 10 {
		.opacity-0#{$i} {
			opacity: $i / 10;
		}
		.fw-#{$i * 100} {
			font-weight: $i * 100;
		}
	}
</style>
