import { createSSRApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue"
import store from "./static/libs/store"
import en from "./locale/en.json";
import zhHans from "./locale/zh-Hans.json";
import "./static/libs/interceptor";

const i18n = createI18n({
    locale: uni.getLocale(),
    messages: { en, "zh-Hans": zhHans, }
})

export const createApp = () => ({ app: createSSRApp(App).use(i18n).use(store) });
