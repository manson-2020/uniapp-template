import Vue from "vue";
import { pageData, sleep, Storage, transformQueryString } from './libs/utils';
import request from "./libs/request";
import { Response, RequestOptions } from './type';
import config from "./config.json";

const { beta, release, path, page, authorizationValidPeriod } = config,
    env: AnyObject = process.env.NODE_ENV === 'development' ? beta : release,
    [API_URL, SOCKET_URL]: [string, string] = [`${env.http}${path.api || ""}`, `${env.socket}${path.socket || ""}`];

const pretreatment: AnyObject = {
    throttle: false,
    times: 0,
    codeHandler: {
        notAuth: async ({ msg: title }: Response): Promise<string | void> => {
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

            const [reqFail, result]: any = await uni.request({
                url: `${API_URL}${path.login}`,
                data: { code: loginRes.code }
            });

            if (reqFail) {
                uni.showToast({ title: reqFail.errMsg, icon: "none" });
                return;
            }
            const { code, data, msg } = result.data;
            if (+code) {
                uni.showToast({ title: msg, icon: "none" });
                return;
            }
            Storage.set("authorization", data, authorizationValidPeriod);

            if (++pretreatment.times >= 3) {
                const [, modal]: any = await uni.showModal({
                    title: "Prompt",
                    content: "Multiple redirects detected, Whether to continue?",
                    confirmText: "Continue",
                    cancelText: "Cancel"
                });
                if (modal.cancel) return;
            }
            pretreatment.times = 0;
            pretreatment.throttle = false;
            const { route, options }: any = pageData(-1);
            uni.reLaunch({ url: `/${route}?${transformQueryString(options)}` });
            return Promise.reject(title);
        },

        fail: (res: Response) => {
            uni.showToast({ title: res.msg, icon: "none" });
            return Promise.reject(res)
        },

        success: (res: Response) => Promise.resolve(res),
    }
}

request.defaults.baseURL = API_URL;

request.interceptors.request.use<RequestOptions>(
    (params: AnyObject) => {
        params.data || (params.data = {});
        params.header.Authorization = Storage.get("authorization") || "";

        for (const key in params.data) {
            if ([undefined, null, NaN].includes(params.data && params.data[key])) {
                delete params?.data[key];
            }
        }
        return params;
    }
);

request.interceptors.response.use<UniApp.RequestSuccessCallbackResult>(
    (res: AnyObject) => {
        const result = <Response | string>res.data;

        try {
            if (typeof (result) === "object") {
                const { success, notAuth, fail } = pretreatment.codeHandler;
                switch (+result.code) {
                    case 0:
                        return success(result);
                    case -3:
                        return notAuth(result);
                    default:
                        return fail(result);
                }
            }
            uni.showModal({
                title: "Error Message",
                content: <string>result,
                confirmText: "Copy", 
                cancelText: "Cancel",
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
    (err: AnyObject) => {
        uni.showToast({ title: err.errMsg, icon: "none" })
        return Promise.reject(err)
    }
);

Vue.prototype.$config = Object.assign(config, { API_URL, SOCKET_URL });
Vue.prototype.$request = request;
