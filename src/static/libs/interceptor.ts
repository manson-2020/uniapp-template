import { pageData, sleep, transformQueryString } from "./utils";
import $config from "./config";
import { Response } from "../type";

const pretreatment = {
    throttle: false,
    times: 0,
    codeHandler: {
        notAuth: async ({ msg: title }: Response): Promise<string | void> => {
            if (pretreatment.throttle) return;
            pretreatment.throttle = true;

            if ($config.page.auth) {
                await uni.showToast({ title, icon: "none", duration: 1200 });
                pretreatment.throttle = true;
                await sleep(1.2)
                await uni.reLaunch({ url: $config.page.auth, success: uni.clearStorage });
                pretreatment.throttle = false;

                return Promise.reject(title);
            }

            const [loginFail, loginRes]: any = await uni.login({});
            if (loginFail) {
                uni.showToast({ title: loginFail.errMsg, icon: "none" });
                return Promise.reject(loginFail.errMsg);
            }

            const [reqFail, result]: any = await uni.request({
                url: `${$config.API_URL}${$config.path.login}`,
                data: { code: loginRes.code }
            });

            if (reqFail) {
                uni.showToast({ title: reqFail.errMsg, icon: "none" });
                return;
            }
            const { code, data, msg } = result.data;
            if (!+code) {
                uni.showToast({ title: msg, icon: "none" });
                return;
            }
            await uni.setStorage({ key: "authInfo", data: { value: data, validityDay: $config.authValidityDay } })

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

        error: (res: Response) => Promise.reject(res),

        success: (res: Response) => Promise.resolve(res),
    }
}

uni.addInterceptor("request", {
    async invoke(args) {
        args.url = $config.API_URL + args.url;
        args.data ?? (args.data = {});
        args.header ?? (args.header = {});
        args.header["Content-type"] = "application/x-www-form-urlencoded";
        // const authInfo = await uni.getStorage({ key: "authInfo" });
        // authInfo && (args.header.token: authInfo.token });
        
        return args;
    },
    success({ data: res }: { data: Response | string }) {
        if (typeof (res) === "string") {
            uni.showModal({
                title: "Error Message",
                content: res,
                confirmText: "Copy",
                cancelText: "Cancel",
                success: ({ confirm }) =>
                    confirm && uni.setClipboardData({
                        data: res,
                        success: () => uni.showToast({ title: "Copied" })
                    })
            });
            return Promise.reject(res);
        }
        const { success, notAuth, fail, error } = pretreatment.codeHandler;
        switch (+res.code) {
            case 400: // 失败
                return fail(res);
            case 200: // 成功
                return success(res);
            case 401: // 未授权
                return notAuth(res);
            default: // 错误
                return error(res);
        }
    },
    fail({ errMsg: title }) {
        uni.showToast({ title, icon: "none" });
    },
    complete(res) {
        console.warn(`Response:`, res);
    }
});

uni.addInterceptor("setStorage", {
    invoke(args) {
        const createTime: number = Date.now();
        args.data = {
            key: args.key,
            value: args.data,
            createTime,
            expireTime: args.data.validityDay ? createTime + args.data.validityDay * 86_400_000 : null
        }
    }
});

uni.addInterceptor("getStorage", {
    success(res) {
        const { key, value, expireTime } = res.data;
        return Promise.resolve((expireTime && Date.now() >= expireTime) ? uni.removeStorageSync(key) : value);
    }
});