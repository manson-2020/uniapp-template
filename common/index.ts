import { pageData, sleep, Storage, transformQueryString } from '@/libs/utils';
import Vue from "vue";
import request from "../libs/request";
import { Response, RequestOptions } from './type';
import config from "./config.json";

const { beta, release, path, page, authorizationValidPeriod } = config,
    env: AnyObject = process.env.NODE_ENV === 'development' ? beta : release,
    [API_URL, SOCKET_URL]: [string, string] = [`${env.http}/${path.api || ""}`, `${env.socket}/${path.socket || ""}`];

const pretreatment: AnyObject = {
    throttle: false,
    times: 0,
    codeHandler: {
        "401": async ({ msg: title }: Response): Promise<string | void> => {
            if (pretreatment.throttle) return;
            pretreatment.throttle = true;

            if (page.authorization) {
                await uni.showToast({ title, icon: "none", duration: 1200 });
                pretreatment.throttle = true;
                await sleep(1.2)
                await uni.reLaunch({ url: page.authorization });
                pretreatment.throttle = false;

                return Promise.reject(title);
            }

            const [loginFail, loginRes]: any = await uni.login({});
            if (loginFail) {
                uni.showToast({ title: loginFail.errMsg, icon: "none" });
                return Promise.reject(loginFail.errMsg);
            }

            const [reqFail, result]: any = await uni.request({ url: `${API_URL}${path.login}?code=${loginRes.code}` });

            if (reqFail) {
                uni.showToast({ title: reqFail.errMsg, icon: "none" });
                return;
            }
            const { code, data, msg } = result.data;
            if (!+code) {
                uni.showToast({ title: msg, icon: "none" });
                return;
            }
            Storage.set("authorization", data?.token, authorizationValidPeriod);

            if (++pretreatment.times >= 3) {
                const [, modal]: any = await uni.showModal({
                    title: "prompt",
                    content: "Multiple redirects detected, Whether to continue?"
                });
                if (modal.cancel) return;
            }
            pretreatment.throttle = false;
            const { route, options }: any = pageData(-1);
            uni.reLaunch({ url: `/${route}?${transformQueryString(options)}` });
            return Promise.reject(title);
        },
        "0": (res: Response) => {
            uni.showToast({ title: res.msg, icon: "none" });
            return Promise.reject(res)
        },

        "1": (res: Response) => Promise.resolve(res),

        "2": (res: Response) => Promise.reject(res)
    }
}

request.defaults.baseURL = API_URL;

request.interceptors.request.use<RequestOptions>(
    params => {
        params.data || (params.data = {});
        params.header.token = Storage.get("authorization") || "";

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
        const result = <Response | string>res.data;

        try {
            if (typeof (result) === "object" && Object.keys(pretreatment.codeHandler).includes(result.code.toString())) {
                return pretreatment.codeHandler[result.code.toString()](result)
            }

            uni.showModal({
                title: "Error Message",
                content: <string>result,
                confirmText: "Copy",
                success: ({ confirm }) =>
                    confirm && uni.setClipboardData({
                        data: <string>result,
                        success: () => uni.showToast({ title: "Copied" })
                    })
            });
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

Vue.prototype.$config = Object.assign(config, { API_URL, SOCKET_URL });
Vue.prototype.$request = request;