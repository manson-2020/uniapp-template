import { createSSRApp } from "vue";
import App from "./App.vue";
import store from "./common/libs/store";
import i18n from "./common/libs/i18n";
import "./common/libs/interceptor";

export const createApp = () => ({ app: createSSRApp(App).use(i18n).use(store) });