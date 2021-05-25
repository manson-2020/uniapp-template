import Vue from 'vue'
import App from './App.vue'
import "./static"
import store from "./static/libs/store"
// #ifdef H5
import "./static/libs/ican-H5Api.js";
// #endif

Vue.config.productionTip = false

new App({ store }).$mount()
