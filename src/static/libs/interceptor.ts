import { isAbsoluteURL } from "./utils";
import $config from "./config";
import { Response } from "../type";
import { pretreatment } from "./dependency"

uni.addInterceptor("request", {
  async invoke(args) {
    let userInfo: any = {};
    if (!$config.ignoreAuthApis.includes(args.url)) {
      userInfo = await uni.getStorage({ key: $config.authInfoStorageKey });
    }
    args.url = isAbsoluteURL(args.url) ? args.url : $config.API_URL + args.url;
    args.data ?? (args.data = {});
    args.header ?? (args.header = {});
    args.header.lang = uni.getLocale();
    args.header["Content-type"] = "application/x-www-form-urlencoded";
    userInfo[$config.authField] && (args.header.token = userInfo[$config.authField]);
    for (let key in args.data) {
      if ([null, undefined, NaN].includes(args.data[key])) delete args.data[key];
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
    console.warn(
      `%c Response `,
      "color: #cfefdf; font-weight:500; background-color: #108ee9; padding: 1px; border-radius: 3px;",
      res
    );
  }
});

uni.addInterceptor("setStorage", {
  invoke(args) {
    switch (args.data?.$type) {
      case "update": {
        if (typeof (args.data.value) !== "object") {
          throw Error(`Invalid prop: type check failed for prop "value". Expected Object with value, got "${String(args.data.value)}".`);
        }
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
        if (typeof (args.data.value) !== "string") {
          throw Error(`Invalid prop: type check failed for prop "value". Expected String with value, got "${String(args.data.value)}".`);
        }
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
      case "create":
        if (!args.data?.value) throw Error(`Invalid prop: type check failed for prop "value". Expected Object with value, got "${String(args.data?.value)}".`);
      case undefined: {
        const createTime = Date.now(),
          validityDay = args.data?.validityDay;
        args.data = {
          value: args.data?.value || args.data,
          key: args.key,
          createTime,
        };
        if (validityDay) {
          if (typeof (validityDay) !== "number") {
            throw Error(`Invalid prop: type check failed for prop "validityDay". Expected Number with value, got "${String(validityDay)}".`);
          }
          args.data.expireTime = createTime + validityDay * 86_400_000;
        }
        return;
      }
      default:
        throw Error(`Invalid prop: type check failed for prop "$type". Expected "update, delete, create or void", got "${String(args.data.$type)}".`);
    }
  }
});

uni.addInterceptor("getStorage", {
  invoke({ key }) {
    const { authInfoStorageKey, authField, page: { auth: url } } = $config;

    if (key === authInfoStorageKey && !uni.getStorageSync(key)?.value?.[authField]) {
      uni.reLaunch({ url });
      return Promise.reject(`${authField} verification failed, Please Reauthorization!`);
    }
  },
  success(res) {
    const { key, value, expireTime } = res.data;
    return Promise.resolve((expireTime && Date.now() >= expireTime) ? uni.removeStorageSync(key) : value);
  }
});
