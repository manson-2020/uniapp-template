import { pageData, transformQueryString, isAbsoluteURL } from "./utils";
import $config from "./config";
import { Response } from "../type";

const pretreatment = {
  throttle: false,
  times: 0,
  codeHandler: {
    notAuth: async ({ msg: content }: Response): Promise<string | void> => {
      if (pretreatment.throttle) return;
      pretreatment.throttle = true;

      if ($config.page.auth) {
        pretreatment.throttle = true;
        uni.showModal({
          content,
          showCancel: false,
          confirmText: "login again",
          success() {
            uni.reLaunch({ url: $config.page.auth, success: uni.clearStorage });
            pretreatment.throttle = false;
          }
        });

        return Promise.reject(content);
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
      return Promise.reject(content);
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
    args.url = isAbsoluteURL(args.url) ? args.url : $config.API_URL + args.url;
    args.data ?? (args.data = {});
    args.header ?? (args.header = {});
    args.header["Content-type"] = "application/x-www-form-urlencoded";
    try {
      const authInfo: any = await uni.getStorage({ key: "authInfo" });
      authInfo && (args.header.token = authInfo.token);
    } catch (error) { }

    for (let key in args.data) {
      if ([null, undefined, NaN].includes(key)) delete args.data[key];
    }
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
      case 200: // 成功
        return success(res);
      case 401: // 未授权
        return notAuth(res);
      case 501: // 失败
        return fail(res);
      default: // 错误
        return error(res);
    }
  },
  fail({ errMsg: title }) {
    uni.showToast({ title, icon: "none" });
  },
  complete(res) {
    console.warn(`%c Response `, "color: #cfefdf; font-weight:500; background-color: #108ee9; padding: 1px; border-radius: 3px;", res);
  }
});

uni.addInterceptor("setStorage", {
  invoke(args) {
    switch (args.data?.$type) {
       case "update": {
        if (typeof (args.data.value) !== "object") throw Error(`Invalid prop: type check failed for prop "value". Expected Object with value, got String.`);
        const originalData = uni.getStorageSync(args.key);
        if (!originalData) throw Error(`No data found to update.`);
        const { value, key, createTime, expireTime } = originalData;
        args.data = {
          value: { ...value, ...args.data.value },
          key,
          createTime,
          expireTime
        };
        return;
      }
      case "delete": {
        if (typeof (args.data.value) !== "string") throw Error(`Invalid prop: type check failed for prop "value". Expected String with value, got Object.`);
        const originalData = uni.getStorageSync(args.key);
        if (!originalData) throw Error(`No data found to delete.`);
        const { value, key, createTime, expireTime } = originalData;
        delete value[args.data.value];
        args.data = {
          value,
          key,
          createTime,
          expireTime
        };
        return;
      }
      default: {
        const createTime = Date.now(),
          validityDay = args.data?.validityDay;
        args.data = {
          value: args.data?.value || args.data,
          key: args.key,
          createTime,
        };
        validityDay && (args.data.expireTime = createTime + validityDay * 86_400_000);
        return;
      }
    }
  }
});

uni.addInterceptor("getStorage", {
  success(res) {
    const { key, value, expireTime } = res.data;
    return Promise.resolve((expireTime && Date.now() >= expireTime) ? uni.removeStorageSync(key) : value);
  }
});
