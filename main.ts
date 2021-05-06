import Vue from 'vue'
import App from './App.vue'
import "./common"
import store from "./static/libs/store"
import "./static/libs/ican-H5Api.js";

Vue.config.productionTip = false

new App({ store }).$mount()
