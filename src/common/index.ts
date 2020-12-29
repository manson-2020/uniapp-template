import { pageData, Storage, transformQueryString } from '@/libs/utils';
import Vue from "vue";
import request, { RequestOptions } from "../libs/request";
import { Response } from './type';
import config, { local, online, path, page, authorizationValidPeriod } from "./config.json";

export const env: AnyObject = process.env.NODE_ENV === 'development' ? local : online;

export const $config: AnyObject = Object.assign(config, {
    API_URL: `http${env.isSecureProtocol ? "s" : ""}://${env.host}${env.port.api ? ":" + env.port.api : ""}${path.api_prefix || ""}`,
    SOCKET_URL: `ws${env.isSecureProtocol ? "s" : ""}://${env.host}${env.port.socket ? ":" + env.port.api : ""}${path.socket || ""}`
});

const pretreatment: AnyObject = {
    debounce: false,
    times: 0,
    codeHandler: {
        "-1": ({ msg: title }: Response): void => {
            if (pretreatment.debounce) return;
            pretreatment.debounce = true;
            Storage.clear();

            page.login ?
                uni.showToast({
                    title,
                    icon: "none",
                    duration: 1200,
                    success: () =>
                        setTimeout(() => uni.reLaunch({ url: `/pages/${page.login}` }), 1200)
                }) :
                uni.login({
                    complete: uni.hideLoading,
                    success: async ({ code }) => {

                        const [logFail, loginRes]: any = (await uni.request({
                            url: `${$config.API_URL}/${path.login_api}`,
                            data: { code }
                        }));

                        if (logFail) {
                            uni.showToast({ title: logFail.errMsg, icon: "none" });
                            return;
                        }

                        const { code: status, data, msg: title } = loginRes.data;

                        if (!+status) {
                            uni.showToast({ title, icon: "none" });
                            return;
                        }

                        Storage.set("userInfo", data.userInfo, authorizationValidPeriod);

                        if (++pretreatment.times >= 3) {
                            const [, modal]: any = await uni.showModal({
                                title: "prompt",
                                content: "Multiple redirects detected，Whether to continue?"
                            });
                            if (modal.cancel) return;
                        }

                        pretreatment.debounce = false;

                        const { route, options }: any = pageData(-1);
                        uni.reLaunch({ url: `/${route}?${transformQueryString(options)}` });
                    }
                });
        },

        "0": (res: Response) => {
            uni.showToast({ title: res.msg, icon: "none" });
            return Promise.reject(res)
        },

        "1": (res: Response) => res,

        "2": (res: Response) => Promise.reject(res),

        "3": (res: Response) => {
            const content = JSON.stringify(res, null, 2);
            uni.showModal({
                title: "Prompt",
                content,
                confirmText: "copy",
                cancelText: "i got it",
                success: ({ confirm }) =>
                    confirm && uni.setClipboardData({ data: content, success: () => uni.showToast({ title: "copied" }) })
            });
        },
    }
}

request.defaults.baseURL = $config.API_URL;

request.interceptors.request.use<RequestOptions>(
    params => {
        params.header.token = Storage.get("userInfo")?.token || "";

        for (const key in params.data) {
            if ([undefined, null, NaN].includes(params.data && params.data[key])) {
                delete params?.data[key];
            }
        }

        return params;
    }
);

request.interceptors.response.use<UniApp.RequestSuccessCallbackResult>(
    res => {
        const result = res.data as Response;

        try {
            if (Object.keys(pretreatment.codeHandler).includes(result.code.toString())) {
                return pretreatment.codeHandler[result.code.toString()](result)
            }

            uni.showToast({ title: "Server error, Please try again later.", icon: "none" });
            return Promise.reject(result);

        } catch ({ message: title }) {
            uni.showToast({ title, icon: "none" });
            return Promise.reject(title);
        } finally {
            console.warn(`Response:`, res);
        }
    },
    err => {
        uni.showToast({ title: err.errMsg, icon: "none" })
        return Promise.reject(err)
    }
);

Vue.prototype.request = request;