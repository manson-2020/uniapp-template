
declare const WeixinJSBridge: AnyObject;

export const prefixZero = (n: number | string): string => String(+n > 9 ? n : `0${n}`)

export function formatDate(timestamp = Date.now(), format = 'Y-M-D h:m:s'): string {
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
        .replace('Y', String(time.Y))
        .replace('M', String(time.M))
        .replace('D', String(time.D))
        .replace('W', String(time.W))
        .replace('h', prefixZero(time.h))
        .replace('m', prefixZero(time.m))
        .replace('s', prefixZero(time.s));
}


/**
* @param { Date } start
* @param { Date } end
* @returns { Array<string> }
*/
export function formatEveryDay(start: Date, end: Date, format: undefined | string = undefined): Array<string> {
    let dateList = [];
    while ((end.getTime() - start.getTime()) >= 0) {
        dateList.push(formatDate(start.getTime(), format));
        start.setDate(start.getDate() + 1);
    }
    return dateList;
}

export function transformURL(url: string, params: any, hash: string) {
    let paramsArr = [];
    for (let key in params) {
        paramsArr.push(`${key}=${params[key]}`);
    }

    return encodeURI(`${url}?${paramsArr.join("&")}#${hash}`);
}

export function wxJsPay(payParams: any, callBack: AnyObject = {}) {
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

export const rand = (min: number, max: number): number => ~~(Math.random() * (max - min + 1) + min);

export function curEnv(): string {
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

export function transformQueryString(params: string | AnyObject): any {
    if (typeof params === "string") {
        const queryStrings: RegExpMatchArray | null = decodeURIComponent(params).match(/[^?&]+=[^?&]+/g);

        return queryStrings ? Object.fromEntries(
            queryStrings.map(item => item.split(/^([^=]*)=*/).filter(item => item))
        ) : Object();
    }

    if (typeof params === "object") {
        return Object.keys(params).map(key => `${key}=${params[key]}`).join("&");
    }

    throw Error("Parameter error");
}

export const isPhoneNumber = (str: string): boolean => /^1[0-9]{10}$/.test(str)

export const isEmail = (str: string): boolean =>
    /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(str)

export const isIdCard = (str: string): boolean =>
    /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str)

// 节流  
export function throttle(fn: Function, wait = 500, isImmediate = false) {

    let flag = true;

    return () => {
        if (flag) {
            isImmediate && fn.apply(fn, arguments);
            flag = false;
            setTimeout(() => {
                !isImmediate && fn.apply(fn, arguments);
                flag = true;
            }, wait)
        }
    }
}

// 防抖  
export function debounce(fn: Function, wait = 500, isImmediate = false) {

    let [timerId, flag]: [number | undefined, boolean] = [undefined, true];

    return () => {
        clearTimeout(timerId);
        if (flag) {
            isImmediate && fn.apply(fn, arguments);
            flag = false
        }
        timerId = setTimeout(() => {
            !isImmediate && fn.apply(fn, arguments);
            isImmediate && (flag = true)
        }, wait)
    }
}

export function pageData(page: number = -2) {
    const pages = getCurrentPages();
    return pages[pages.length + page];
}

/**
 * 缓存 增删查改
 */
export const Storage = {
    set(key: string, value: any, time: null | number = Infinity): void {
        const timestamp: number = Date.now();
        uni.setStorageSync(key, {
            value,
            createTime: timestamp,
            expireTime: time ? timestamp + time * 1000 : time
        });
    },
    remove(...args: string[]): void {
        args.forEach((key: string): void => uni.removeStorageSync(key));
    },
    get(key: string): any {
        const [timestamp, { expireTime, value }]: [number, any] = [Date.now(), uni.getStorageSync(key)];
        return (expireTime && timestamp >= expireTime) ? this.remove(key) : value;
    },
    update(key: string, prototypes: AnyObject, expireTime: null | number = Infinity): void {
        const { value, createTime, expireTime: storageExpire } = uni.getStorageSync(key) || {};

        if (Object.prototype.toString.call(value) === "[object Object]") {
            return uni.setStorageSync(key, {
                value: Object.assign(value, prototypes),
                createTime,
                expireTime: expireTime || storageExpire
            })
        }

        this.set(key, prototypes, expireTime)
    },
    clear(): void {
        uni.clearStorageSync()
    }
}

export function bind(fn: Function, thisArg: any) {
    return function warp() {
        return fn.apply(thisArg, Array.from(arguments))
    }
}

export function extend(a: any, b: any, thisArg?: {}) {
    let o = Object.getOwnPropertyNames(b);
    o.forEach(attr => {
        if (thisArg && typeof b[attr] === "function") {
            a[attr] = bind(b[attr], thisArg)
        } else {
            a[attr] = b[attr];
        }
    });
    return a;
}

export function merge(...arg: any) {
    var result: any = {};
    Array.from(arg).forEach((e: any) => {
        for (let key in e) {
            if (typeof e[key] === 'object' && !isEmptyObject(e[key])) {
                merge(result[key], e[key])
            }
            result[key] = e[key]
        }
    });
    return result;
}

export function deepMerge(...arg: any) {
    let result: any = {};
    Array.from(arg).forEach((e: any) => {
        if (e && typeof e === 'object' && !isEmptyObject(e)) {
            Object.keys(e).forEach(key => {
                if (typeof e[key] === 'object') {
                    return result[key] = deepMerge(result[key], e[key])
                }
                result[key] = e[key]
            });
        }
    })
    return result;
}

export function isEmptyObject(obj: any) {
    return Object.getOwnPropertyNames(obj).length === 0
}

export function combineURLs(baseURL: any, relativeURL: any) {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
};

export function encode(val: any) {
    return encodeURIComponent(val).
        replace(/%40/gi, '@').
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
}

export function buildURL(url: any, paramsObject: any) {
    if (!paramsObject || isEmptyObject(paramsObject)) return url;
    let parts: any = [];
    Object.keys(paramsObject).forEach(key => {
        parts.push(encode(key) + '=' + encode(paramsObject[key]));
    });
    return url += (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&');
}

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */

export function isAbsoluteURL(url: any) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};
