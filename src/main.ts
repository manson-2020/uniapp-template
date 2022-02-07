import { createSSRApp } from "vue";
import App from "./App.vue"
import store from "./static/libs/store";
import i18n from "./static/libs/i18n";
import "./static/libs/interceptor";


export const createApp = () => ({ app: createSSRApp(App).use(i18n).use(store) });
