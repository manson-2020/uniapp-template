
import Vue from "vue";
import { Response } from "./type";
import { Storage, transformQueryString } from '@/libs/utils';
import request, { Options } from "../libs/request";
import config, { local, online, path, page } from "./config.json";

export const env: any = process.env.NODE_ENV === 'development' ? local : online;

export const $config: any = Object.assign(config, {
    API_URL: `http${env.isSecureProtocol ? "s" : ""}://${env.host}:${env.port.api}${path.api}`,
    SOCKET_URL: `ws${env.isSecureProtocol ? "s" : ""}://${env.host}:${env.port.socket}${path.socket}`
});

const pretreatment: { debounce: boolean, codeHandler: { [props: string]: any } } = {
    debounce: false,
    codeHandler: {
        "-1": ({ data }: { data: Response }) => {
            if (pretreatment.debounce) return;
            pretreatment.debounce = true;
            Storage.clear();

            page.login ?
                uni.showToast({
                    title: data.msg,
                    icon: "none",
                    duration: 1200,
                    success: () => setTimeout(() => uni.reLaunch({ url: page.login }), 1200)
                }) :
                uni.login({
                    complete: uni.hideLoading,
                    success: async ({ code }) => {

                        const [logFail, loginRes]: any = (await uni.request({
                            url: `${$config.API_URL}${path.api}${path.login}`,
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

                        Storage.set("token", data.token);
                        Storage.set("userInfo", data.userInfo);

                        const pages = getCurrentPages(),
                            { route, options }: any = pages[pages.length - 1],
                            url = `/ ${route} ? ${transformQueryString(options)}`;

                        pretreatment.debounce = false;

                        uni.reLaunch({ url });
                    }
                });
        },

        "0": ({ data: result }: { data: Response }) => { uni.showToast({ title: result.msg, icon: "none" }) },

        "1": ({ data }: { data: Response }): Response => data,

        "-2": (res: { data: Response }) => {
            uni.showModal({ title: "Prompt", content: JSON.stringify(res, null, 2), showCancel: false, confirmText: "i got it" });
        },

    }
}


request.defaults.timeout = 9000;
request.defaults.baseURL = $config.API_URL;

request.interceptors.request.use<Options>(
    params => {
        params.header.token = Storage.get("token");
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
        try {
            const result = res.data as { code: number, data: null | { [props: string]: any }, msg: string };

            if (Object.keys(pretreatment.codeHandler).includes(result.code.toString())) {
                return pretreatment.codeHandler[result.code.toString()](res) ?? Promise.reject(result);
            }

            uni.showToast({ title: "Server error, Please try again later.", icon: "none" });

            return Promise.reject("Server Error");
        }
        catch (e) {
            uni.showToast({ title: e.message, icon: "none" });
            return Promise.reject(e.message);
        }
    },
    err => {
        uni.showToast({ title: err.errMsg, icon: "none" })
        return Promise.reject(err)
    }
);

Vue.prototype.request = request;
