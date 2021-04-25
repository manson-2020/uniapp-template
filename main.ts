import Vue from 'vue'
import App from './App.vue'
import "./common"
import store from "./libs/store"
import "./static/js/ican-H5Api.js";

Vue.config.productionTip = false

new App({ store }).$mount()
