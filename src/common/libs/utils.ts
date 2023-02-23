
export const prefixZero = (n: number | string): string => String(+n > 9 ? n : `0${n}`)

export const formatPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber && phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

export const rand = (min: number, max: number): number => ~~(Math.random() * (max - min + 1) + min);

export const transformQueryString = (params: string | AnyObject): string | AnyObject | void => {
  if (typeof params === "string") {
    const queryStrings: RegExpMatchArray | null = params.match(/[^?&]+=[^?&]+/g);
    return queryStrings ? Object.fromEntries(
      queryStrings.map(item => item.split(/^([^=]*)=*/).filter(item => item))
    ) : {};
  }
  if (typeof params === "object") {
    return Object.keys(params).filter(key => ![undefined, null].includes(params[key])).map(key => `${key}=${params[key]}`).join("&");
  }
  throw Error("Parameter error");
}

export const transformURL = (url: string, params: { [key: string]: any }, hash: string | void) =>
  encodeURIComponent(url + (params ? `?${transformQueryString(params)}` : "") + (hash ? `#${hash}` : ""));

export const isPhoneNumber = (str: string): boolean => /^1[0-9]{10}$/.test(str)

export const isEmail = (str: string): boolean => /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(str);

export const isIdCard = (str: string): boolean =>
  /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str);

export const isEmptyObject = (obj: AnyObject): obj is {} => (Object.getOwnPropertyNames(obj).length === 0);

export const pageData = (page: number = -2): Page.PageInstance => {
  const pages = getCurrentPages();
  return pages[pages.length + page];
}

export const sleep = (delay: number): Promise<number> => (new Promise(resolve => setTimeout(resolve, delay * 1000)));


/**
 * @param {number} timestamp
 * @param {string} format
 * @return Format Date
*/
export const formatDate = ({ format = "Y-M-D h:m:s", timestamp = Date.now() }): string => {

  const date = new Date(String(timestamp).length !== 13 ? timestamp * 1000 : timestamp)

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
* @param {Date} start
* @param {Date} end
* @returns {Array<string>}
*/
export const formatEveryDay = (start: Date, end: Date, format: undefined | string = undefined): Array<string> => {
  let dateList = [];
  while ((end.getTime() - start.getTime()) >= 0) {
    dateList.push(formatDate({ format, timestamp: start.getTime() }));
    start.setDate(start.getDate() + 1);
  }
  return dateList;
}

export const formatDuration = (seconds: number) => {
  const h = ~~(seconds / 3600)
  const m = ~~(seconds / 60 % 60)
  const s = Math.ceil(seconds % 60)

  const hours = h < 10 ? '0' + h : h;
  const formatSecond = s > 59 ? 59 : s;
  return `${hours > 0 ? `${hours}:` : ''}${m < 10 ? '0' + m : m}:${formatSecond < 10 ? '0' + formatSecond : formatSecond}`;
}

export const parseJSON = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
}

export const sortLetter = (letters: string) => [...letters.replaceAll(",", "")]
  .sort((a, b) => Number(a.charCodeAt(0).toString(16)) - Number(b.charCodeAt(0).toString(16)))
  .join(",")

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
export const isAbsoluteURL = (url: string): boolean => /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);

/**
 * 防抖: 频繁调用函数时重置上次延迟再执行
 * 
 * @param {Function} fn 防抖函数
 * @param {delay} delay 延迟时间
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 返回执行任务,附带cancel方法
 */
export const debounce = (fn: Function, delay = 300, immediate = false) => {
  let timer: null | number | NodeJS.Timeout = null;

  const task = (...args: any[]) => {
    if (timer) {
      clearTimeout(<number>timer);
      timer = null;
    }

    if (immediate) {
      !timer && fn(args);
      timer = setTimeout(() => { timer = null }, delay);
      return;
    }

    timer = setTimeout(() => { fn(args) }, delay);
  };

  task.cancel = () => {
    if (timer) {
      clearTimeout(<number>timer);
      timer = null;
    }
  }

  return task;
}

/**
 * 节流: 频繁调用函数时按固定延迟时间执行
 * 
 * @param {Function} fn 节流函数
 * @param {delay} delay 延迟时间
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 返回执行任务,附带cancel方法
 */
export const throttle = (fn: Function, delay = 300, immediate = false) => {
  let timer: null | number | NodeJS.Timeout = null;

  const task = (...args: any[]) => immediate ?
    fn(args) : (!timer && (timer = setTimeout(() => {
      fn(args);
      timer = null;
    }, delay)));

  task.cancel = () => {
    if (timer) {
      clearTimeout(<number>timer);
      timer = null;
    }
  }

  return task;
}

export const uniNavigator = ({ type = "navigateTo", url }: {
  type?: "reLaunch" | "navigateTo" | "switchTab" | "redirectTo",
  url: string
}) => {
  return {
    reLaunch: () => uni.reLaunch({ url }),
    navigateTo: () => uni.navigateTo({ url }),
    switchTab: () => uni.switchTab({ url }),
    redirectTo: () => uni.redirectTo({ url }),
  }[type]();
}

export const curEnv = () => {
  let curEnv;
  // #ifdef H5
  curEnv =
    navigator.userAgent
      .toLowerCase()
      .indexOf("micromessenger") != -1
      ? "WeChatH5"
      : "H5";
  // #endif
  // #ifdef MP
  curEnv = "MP";
  // #endif
  // #ifdef APP_PLUS
  curEnv = "APP";
  // #endif
  return curEnv;
}

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

