<template>
	<view class="u-image" @tap="onClick" :style="wrapStyle">
		<image v-if="!isError" :src="src" :mode="mode" @error="onErrorHandler" @load="onLoadHandler"
			:show-menu-by-longpress="showMenuByLongpress" :lazy-load="lazyLoad" class="u-image__image" :style="showStyle" />
		<view v-if="showLoading && loading" class="u-image__loading" :style="showStyle">
			<slot name="loading">
				<uni-icons :type="loadingIcon" :size="Math.min(width, height) / 4" />
			</slot>
		</view>
		<view v-if="showError && isError && !loading" class="u-image__error" :style="showStyle">
			<slot name="error">
				<uni-icons :type="errorIcon" :size="width" />
			</slot>
		</view>
	</view>
</template>

<script>
/**
 * Image 图片
 * @description 此组件为uni-app的image组件的加强版，在继承了原有功能外，还支持淡入动画、加载中、加载失败提示、圆角值和形状等。
 * @tutorial https://uviewui.com/components/image.html
 * @property {String}			src 				图片地址
 * @property {String}			mode 				裁剪模式，见官网说明 （默认 'aspectFill' ）
 * @property {String | Number}	width 				宽度，单位任意，如果为数值，则为px单位 （默认 '300' ）
 * @property {String | Number}	height 				高度，单位任意，如果为数值，则为px单位 （默认 '225' ）
 * @property {String}			shape 				图片形状，circle-圆形，square-方形 （默认 'square' ）
 * @property {String | Number}	radius		 		圆角值，单位任意，如果为数值，则为px单位 （默认 0 ）
 * @property {Boolean}			lazyLoad			是否懒加载，仅微信小程序、App、百度小程序、字节跳动小程序有效 （默认 true ）
 * @property {Boolean}			showMenuByLongpress	是否开启长按图片显示识别小程序码菜单，仅微信小程序有效 （默认 true ）
 * @property {String}			loadingIcon 		加载中的图标，或者小图片 （默认 'photo' ）
 * @property {String}			errorIcon 			加载失败的图标，或者小图片 （默认 'error-circle' ）
 * @property {Boolean}			showLoading 		是否显示加载中的图标或者自定义的slot （默认 true ）
 * @property {Boolean}			showError 			是否显示加载错误的图标或者自定义的slot （默认 true ）
 * @property {Boolean}			fade 				是否需要淡入效果 （默认 true ）
 * @property {Boolean}			webp 				只支持网络资源，只对微信小程序有效 （默认 false ）
 * @property {String | Number}	duration 			搭配fade参数的过渡时间，单位ms （默认 500 ）
 * @property {String}			bgColor 			背景颜色，用于深色页面加载图片时，为了和背景色融合  (默认 '#f3f4f6' )
 * @property {Object}			customStyle  		定义需要用到的外部样式
 * @event {Function}	click	点击图片时触发
 * @event {Function}	error	图片加载失败时触发
 * @event {Function} load 图片加载成功时触发
 * @example <u-image width="100%" height="300px" :src="src"></u-image>
 */


/**
* 判断是否为空
*/
function isEmpty(value) {
	switch (typeof value) {
		case 'undefined':
			return true
		case 'string':
			if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
			break
		case 'boolean':
			if (!value) return true
			break
		case 'number':
			if (value === 0 || isNaN(value)) return true
			break
		case 'object':
			if (value === null || value.length === 0) return true
			for (const i in value) {
				return false
			}
			return true
	}
	return false
}
/**
 * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
 * @param {string|number} value 需要添加单位的值
 * @param {string} unit 添加的单位名 比如px
 */
function addUnit(value = 'auto', unit = '') {
	if (!unit) {
		unit = "rpx";
	}
	value = String(value)
	// 用uView内置验证规则中的number判断是否为数值
	return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value) ? `${value}${unit}` : value
}
/**
 * @description 样式转换
 * 对象转字符串，或者字符串转对象
 * @param {object | string} customStyle 需要转换的目标
 * @param {String} target 转换的目的，object-转为对象，string-转为字符串
 * @returns {object|string}
 */
function addStyle(customStyle, target = 'object') {
	// 字符串转字符串，对象转对象情形，直接返回
	if (isEmpty(customStyle) || typeof (customStyle) === 'object' && target === 'object' || target === 'string' &&
		typeof (customStyle) === 'string') {
		return customStyle
	}
	// 字符串转对象
	if (target === 'object') {
		// 去除字符串样式中的两端空格(中间的空格不能去掉，比如padding: 20px 0如果去掉了就错了)，空格是无用的
		customStyle = trim(customStyle)
		// 根据";"将字符串转为数组形式
		const styleArray = customStyle.split(';')
		const style = {}
		// 历遍数组，拼接成对象
		for (let i = 0; i < styleArray.length; i++) {
			// 'font-size:20px;color:red;'，如此最后字符串有";"的话，会导致styleArray最后一个元素为空字符串，这里需要过滤
			if (styleArray[i]) {
				const item = styleArray[i].split(':')
				style[trim(item[0])] = trim(item[1])
			}
		}
		return style
	}
}

/**
 * @description 深度克隆
 * @param {object} obj 需要深度克隆的对象
 * @returns {*} 克隆后的对象或者原值（不是对象）
 */
function deepClone(obj) {
	// 对常见的“非”值，直接返回原来值
	if ([null, undefined, NaN, false].includes(obj)) return obj
	if (typeof obj !== 'object' && typeof obj !== 'function') {
		// 原始类型直接返回
		return obj
	}
	const o = Array.isArray(obj) ? [] : {}
	for (const i in obj) {
		if (obj.hasOwnProperty(i)) {
			o[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
		}
	}
	return o
}

/**
 * @description JS对象深度合并
 * @param {object} target 需要拷贝的对象
 * @param {object} source 拷贝的来源对象
 * @returns {object|boolean} 深度合并后的对象或者false（入参有不是对象）
 */
function deepMerge(target = {}, source = {}) {
	target = deepClone(target)
	if (typeof target !== 'object' || typeof source !== 'object') return false
	for (const prop in source) {
		if (!source.hasOwnProperty(prop)) continue
		if (prop in target) {
			if (typeof target[prop] !== 'object') {
				target[prop] = source[prop]
			} else if (typeof source[prop] !== 'object') {
				target[prop] = source[prop]
			} else if (target[prop].concat && source[prop].concat) {
				target[prop] = target[prop].concat(source[prop])
			} else {
				target[prop] = deepMerge(target[prop], source[prop])
			}
		} else {
			target[prop] = source[prop]
		}
	}
	return target
}

const defaultProps = {
	src: '',
	mode: 'aspectFill',
	width: '',
	height: '',
	shape: 'square',
	radius: 0,
	lazyLoad: true,
	showMenuByLongpress: true,
	loadingIcon: 'spinner-cycle',
	errorIcon: 'image-filled',
	showLoading: true,
	showError: true,
	fade: true,
	webp: false,
	duration: 600,
	bgColor: '#f3f4f6'
};

export default {
	name: 'u-image',
	props: {
		// #ifdef MP-WEIXIN
		// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性
		options: {
			virtualHost: true
		},
		// #endif
		customStyle: {
			type: [Object, String],
			default: () => ({})
		},
		customClass: {
			type: String,
			default: ''
		},
		// 图片地址
		src: {
			type: String,
			default: defaultProps.src
		},
		// 裁剪模式
		mode: {
			type: String,
			default: defaultProps.mode
		},
		// 宽度，单位任意
		width: {
			type: [String, Number],
			default: defaultProps.width
		},
		// 高度，单位任意
		height: {
			type: [String, Number],
			default: defaultProps.height
		},
		// 图片形状，circle-圆形，square-方形
		shape: {
			type: String,
			default: defaultProps.shape
		},
		// 圆角，单位任意
		radius: {
			type: [String, Number],
			default: defaultProps.radius
		},
		// 是否懒加载，微信小程序、App、百度小程序、字节跳动小程序
		lazyLoad: {
			type: Boolean,
			default: defaultProps.lazyLoad
		},
		// 开启长按图片显示识别微信小程序码菜单
		showMenuByLongpress: {
			type: Boolean,
			default: defaultProps.showMenuByLongpress
		},
		// 加载中的图标，或者小图片
		loadingIcon: {
			type: String,
			default: defaultProps.loadingIcon
		},
		// 加载失败的图标，或者小图片
		errorIcon: {
			type: String,
			default: defaultProps.errorIcon
		},
		// 是否显示加载中的图标或者自定义的slot
		showLoading: {
			type: Boolean,
			default: defaultProps.showLoading
		},
		// 是否显示加载错误的图标或者自定义的slot
		showError: {
			type: Boolean,
			default: defaultProps.showError
		},
		// 是否需要淡入效果
		fade: {
			type: Boolean,
			default: defaultProps.fade
		},
		// 只支持网络资源，只对微信小程序有效
		webp: {
			type: Boolean,
			default: defaultProps.webp
		},
		// 过渡时间，单位ms
		duration: {
			type: [String, Number],
			default: defaultProps.duration
		},
		// 背景颜色，用于深色页面加载图片时，为了和背景色融合
		bgColor: {
			type: String,
			default: defaultProps.bgColor
		}
	},
	data() {
		return {
			addUnit,
			// 图片是否加载错误，如果是，则显示错误占位图
			isError: false,
			// 初始化组件时，默认为加载中状态
			loading: true,
			// 不透明度，为了实现淡入淡出的效果
			opacity: 1,
			// 过渡时间，因为props的值无法修改，故需要一个中间值
			durationTime: this.duration,
			// 图片加载完成时，去掉背景颜色，因为如果是png图片，就会显示灰色的背景
			backgroundStyle: {}
		};
	},
	watch: {
		src: {
			immediate: true,
			handler(n) {
				if (!n) {
					// 如果传入null或者''，或者false，或者undefined，标记为错误状态
					this.isError = true

				} else {
					this.isError = false;
					this.loading = true;
				}
			}
		}
	},
	computed: {
		wrapStyle() {
			let style = {};
			// 通过调用addUnit()方法，如果有单位，如百分比，px单位等，直接返回，如果是纯粹的数值，则加上rpx单位
			style.width = addUnit(this.width);
			style.height = addUnit(this.height);
			// 如果是显示圆形，设置一个很多的半径值即可
			style.borderRadius = this.shape == 'circle' ? '10000px' : addUnit(this.radius)
			// 如果设置圆角，必须要有hidden，否则可能圆角无效
			style.overflow = this.radius > 0 ? 'hidden' : 'visible';

			if (this.fade) {
				style.opacity = 0;
				if (!this.loading) {
					style.opacity = this.opacity
					// nvue下，这几个属性必须要分开写
					style.transitionDuration = `${this.durationTime}ms`
					style.transitionTimingFunction = 'ease-in-out'
					style.transitionProperty = 'opacity'
				}
			}
			return deepMerge(style, addStyle(this.customStyle));
		},
		showStyle() {
			return [
				{ borderRadius: this.shape == 'circle' ? '10000px' : addUnit(this.radius) },
				this.width ? { width: addUnit(this.width) } : {}, this.height ? { height: addUnit(this.height) } : {}
			]
		}
	},
	emits: ['click', 'error', 'load'],
	methods: {
		// 点击图片
		onClick() {
			this.$emit('click')
		},
		// 图片加载失败
		onErrorHandler(err) {
			this.loading = false
			this.isError = true
			this.$emit('error', err)
		},
		// 图片加载完成，标记loading结束
		onLoadHandler(event) {
			this.loading = false
			this.isError = false
			this.$emit('load', event)
		},
	}
};
</script>

<style lang="scss" scoped>
// 通过scss的mixin功能，把原来需要写4行的css，变成一行
// 目的是保持代码干净整洁，不至于在nvue下，到处都要写display:flex的条件编译
@mixin flex($direction: row) {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: $direction;
}

/* #ifndef APP-NVUE */
// 由于uView是基于nvue环境进行开发的，此环境中普通元素默认为flex-direction: column;
// 所以在非nvue中，需要对元素进行重置为flex-direction: column; 否则可能会表现异常
view,
scroll-view,
swiper-item {
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	flex-grow: 0;
	flex-basis: auto;
	align-items: stretch;
	align-content: flex-start;
}

/* #endif */


$u-image-error-top: 0px !default;
$u-image-error-left: 0px !default;
$u-image-error-width: 100% !default;
$u-image-error-hight: 100% !default;
$u-image-error-background-color: #f3f4f6 !default;
$u-image-error-color: #909193 !default;
$u-image-error-font-size: 46rpx !default;


@keyframes rotate {
	0% {
		transform: rotate(0);
	}

	50% {
		transform: rotate(180deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

.u-image {
	position: relative;
	transition: opacity 0.5s ease-in-out;

	&__image {
		width: 100%;
		height: 100%;
	}

	&__loading,
	&__error {
		position: absolute;
		top: $u-image-error-top;
		left: $u-image-error-left;
		width: $u-image-error-width;
		height: $u-image-error-hight;
		@include flex;
		align-items: center;
		justify-content: center;
		color: $u-image-error-color;
		font-size: $u-image-error-font-size;
	}

	&__loading {
		animation: rotate ease-in-out 2s infinite;
	}

	&__error {
		background-color: $u-image-error-background-color;
	}
}
</style>
