declare const WeixinJSBridge: AnyObject;

export const wxJsPay = (payParams: any, callBack: AnyObject = {}): void => {
  WeixinJSBridge.invoke(
    "getBrandWCPayRequest",
    payParams,
    ({ err_msg }: any) => (
      callBack.complete(),
      err_msg == "get_brand_wcpay_request:ok" ?
        uni.showToast({ title: "支付成功", complete: callBack.success }) :
        uni.showToast({ title: "支付失败", icon: "none", complete: callBack.fail })
    )
  );
}

export const prefixZero = (n: number | string): string => String(+n > 9 ? n : `0${n}`)

export const formatDate = (format = "Y-M-D h:m:s", timestamp = Date.now()): string => {
  /**
   * @method prefixZero
   * @param {timestamp} number
   * @param {format} string
   * @return {string}
   */
  const date = new Date(timestamp)

  const time = {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    W: date.getDay(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }
  return format
    .replace("Y", String(time.Y))
    .replace("M", prefixZero(time.M))
    .replace("D", prefixZero(time.D))
    .replace("W", String(time.W))
    .replace("h", prefixZero(time.h))
    .replace("m", prefixZero(time.m))
    .replace("s", prefixZero(time.s));
}

/**
* @param { Date } start
* @param { Date } end
* @returns { Array<string> }
*/
export const formatEveryDay = (start: Date, end: Date, format: undefined | string = undefined): Array<string> => {
  let dateList = [];
  while ((end.getTime() - start.getTime()) >= 0) {
    dateList.push(formatDate(format, start.getTime()));
    start.setDate(start.getDate() + 1);
  }
  return dateList;
}

export const transformURL = (url: string, params: { [key: string]: any }, hash: string | void) => {
  let paramsArr = Object.keys(params).map(key => `${key}=${params[key]}`);

  return encodeURIComponent(`${url}?${paramsArr.join("&")}${hash ? "#" + hash : ""}`);
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

export const rand = (min: number, max: number): number => ~~(Math.random() * (max - min + 1) + min);

export const curEnv = (): string => {
  let curEnv;
  // #ifdef H5
  curEnv =
    navigator.userAgent
      .toLowerCase()
      .indexOf("micromessenger") != -1
      ? "wechat"
      : "other";
  // #endif
  // #ifdef APP_PLUS
  curEnv = "app";
  // #endif
  return curEnv;
}

export const transformQueryString = (params: string | AnyObject): string | AnyObject | void => {
  if (typeof params === "string") {
    const queryStrings: RegExpMatchArray | null = params.match(/[^?&]+=[^?&]+/g);

    return queryStrings ? Object.fromEntries(
      queryStrings.map(item => item.split(/^([^=]*)=*/).filter(item => item))
    ) : {};
  }

  if (typeof params === "object") {
    return Object.keys(params).filter(key => params[key]).map(key => `${key}=${params[key]}`).join("&");
  }

  throw Error("Parameter error");
}

export const isPhoneNumber = (str: string): boolean => /^1[0-9]{10}$/.test(str)

export const isEmail = (str: string): boolean => /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(str);

export const isIdCard = (str: string): boolean => /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str);

export const sleep = (second: number): Promise<number> => (new Promise(resolve => setTimeout(resolve, second * 1000)));

export const pageData = (page: number = -2): Page.PageInstance => {
  const pages = getCurrentPages();
  return pages[pages.length + page];
}

// 防抖  
export const debounce = (fn: Function, delay: number = 500, isImmediate: boolean = false): { exec: Function } => {
  let [timer, flag]: [number | NodeJS.Timeout, boolean] = [0, true];

  return {
    exec: (...args: any[]) => {
      timer && clearTimeout(timer as number);
      if (flag) {
        isImmediate && fn(args);
        flag = false;
      }
      timer = setTimeout(() => (isImmediate ? (flag = true) : fn(args)), delay)
    }
  }
}

// 节流  
export const throttle = (fn: Function, delay = 500, isImmediate = false): { exec: Function } => {
  let flag = true;
  return {
    exec: (...args: any[]) => {
      if (flag) {
        isImmediate && fn(args);
        flag = false;
        setTimeout(() => {
          !isImmediate && fn(args);
          flag = true;
        }, delay)
      }

    }
  }
}

export const bind = (fn: Function, thisArg: any): Function => (...arg: any[]) => fn.apply(thisArg, arg);

export const extend = (a: AnyObject, b: AnyObject, thisArg?: {}): AnyObject => {
  let o: string[] = Object.getOwnPropertyNames(b);
  o.forEach(attr => {
    if (thisArg && typeof b[attr] === "function") {
      a[attr] = bind(b[attr], thisArg)
    } else {
      a[attr] = b[attr];
    }
  });
  return a;
}

export const merge = (...arg: AnyObject[]): AnyObject => {
  var result: AnyObject = {};
  arg.forEach((e: AnyObject) => {
    for (let key in e) {
      if (typeof e[key] === "object" && !isEmptyObject(e[key])) {
        merge(result[key], e[key])
      }
      result[key] = e[key]
    }
  });
  return result;
}

export const deepMerge = (...arg: AnyObject[]): AnyObject => {
  let result: AnyObject = {};
  arg.forEach((e: AnyObject) => {
    if (e && typeof e === "object" && !isEmptyObject(e)) {
      Object.keys(e).forEach(key => {
        if (typeof e[key] === "object") {
          return result[key] = deepMerge(result[key], e[key])
        }
        result[key] = e[key]
      });
    }
  })
  return result;
}

export const isEmptyObject = (obj: AnyObject): obj is {} => (Object.getOwnPropertyNames(obj).length === 0);

export const combineURLs = (baseURL: string, relativeURL: string, identifier: string = "/"): string => {
  return relativeURL
    ? baseURL.replace(new RegExp(`${identifier}+$`), "")
    + identifier
    + relativeURL.replace(new RegExp(`^${identifier}`), "")
    : baseURL
};

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
export const isAbsoluteURL = (url: string): boolean => /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
