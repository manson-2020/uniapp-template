<template>
	<web-view :webview-styles="webviewStyles" :src="url" />
</template>

<script lang="ts">
	import { Vue, Component } from "vue-property-decorator";

	@Component
	export default class webView extends Vue {
		url: string = "";
		webviewStyles: AnyObject = {
			progress: {
				color: "#1ba0ff",
			},
		};
		onLoad({ url = "https://m.baidu.com" }: AnyObject) {
			this.url = decodeURIComponent(url);
		}
	}
</script>

<style lang="scss" scoped>
	// scss
</style>