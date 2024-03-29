
import { requestInterceptorOptions } from "./dependency";

uni.addInterceptor("request", requestInterceptorOptions("data"));

uni.addInterceptor("uploadFile", requestInterceptorOptions("formData"));

uni.addInterceptor("setStorage", {
  invoke(args) {
    switch (args.data?.$type) {
      case "update": {
        if (typeof (args.data.value) !== "object") {
          return Promise.reject(Error(`Invalid prop: type check failed for prop "value". Expected Object with value, got "${String(args.data.value)}".`));
        }
        const originalData = uni.getStorageSync(args.key) || {};
        const { value = {}, createTime, expireTime } = originalData;
        args.data = {
          value: { ...value, ...args.data.value },
          key: args.key,
          createTime,
          expireTime
        };
        break;
      }
      case "delete": {
        if (typeof (args.data.value) !== "string") {
          return Promise.reject(Error(`Invalid prop: type check failed for prop "value". Expected String with value, got "${String(args.data.value)}".`));
        }
        const originalData = uni.getStorageSync(args.key);
        if (!originalData) return Promise.reject(Error(`No data found to delete.`));
        const { value, key, createTime, expireTime } = originalData;
        delete value[args.data.value];
        args.data = {
          value,
          key,
          createTime,
          expireTime
        };
        break;
      }
      case "create":
        if (!args.data?.value) {
          return Promise.reject(Error(`Invalid prop: type check failed for prop "value". Expected Object with value, got "${String(args.data?.value)}".`));
        };
      case undefined: {
        const createTime = Date.now(),
          validityDay = args.data?.validityDay || 0;
        args.data = {
          value: args.data?.value || args.data,
          key: args.key,
          createTime,
        };
        if (validityDay) {
          if (typeof (validityDay) !== "number") {
            return Promise.reject(Error(`Invalid prop: type check failed for prop "validityDay". Expected Number with value, got "${String(validityDay)}".`));
          }
          args.data.expireTime = createTime + validityDay * 86_400_000;
        }
        break;
      }
      default:
        return Promise.reject(Error(`Invalid prop: type check failed for prop "$type". Expected "update, delete, create or void", got "${String(args.data.$type)}".`));
    };
    return args;
  }
});

uni.addInterceptor("getStorage", {
  success(res) {
    const { key, value, expireTime } = res.data;
    return Promise.resolve((expireTime && Date.now() >= expireTime) ? uni.removeStorageSync(key) : value);
  }
});