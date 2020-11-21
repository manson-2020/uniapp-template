

import {
    merge,
    deepMerge,
    isAbsoluteURL,
    combineURLs,
    bind,
    extend
} from './utils';

interface RequestMethodOptions {
    /**
     * 请求的参数
     */
    data?: { [props: string]: any },
    /**
    * 基础地址
    */
    baseURL?: string,
    transformRequest?: <T>(data: T) => T,
    transformResponse?: <T>(data: T) => T,
    /**
     * 设置请求的 header，header 中不能设置 Referer。
     */
    header?: any;
    /**
     * 超时时间
     */
    timeout?: number;
    /**
     * 如果设为json，会尝试对返回的数据做一次 JSON.parse
     */
    dataType?: string;
    /**
     * 设置响应的数据类型。合法值：text、arraybuffer
     */
    responseType?: string;
    /**
     * 验证 ssl 证书
     */
    sslVerify?: boolean;
    /**
     * 跨域请求时是否携带凭证
     */
    withCredentials?: boolean;
    /**
     * DNS解析时优先使用 ipv4
     */
    firstIpv4?: boolean;
    /**
     * 成功返回的回调函数
     */
    success?: (result: UniApp.RequestSuccessCallbackResult) => void;
    /**
     * 失败的回调函数
     */
    fail?: (result: UniApp.GeneralCallbackResult) => void;
    /**
     * 结束的回调函数（调用成功、失败都会执行）
     */
    complete?: (result: UniApp.GeneralCallbackResult) => void;
}

type Methods = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';

interface RequestOptions extends RequestMethodOptions {
    /**
    * 默认为 GET
    * 可以是：OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT
    */
    method?: Methods;
}

export interface Options extends UniApp.RequestOptions {
    data?: { [props: string]: any },
    /**
    * 基础地址
    */
    baseURL?: string,
    transformRequest?: <T>(data: T) => T,
    transformResponse?: <T>(data: T) => T,
}


const defaults: Options = {
    url: '',
    baseURL: '',
    dataType: 'json',
    responseType: 'text',
    header: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    // timeout: 0,
    transformRequest: data => data,

    transformResponse: data => data,

};
const methods: Array<Methods> = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT']

const dispatchRequest = (option: Options): Promise<UniApp.RequestSuccessCallbackResult | UniApp.RequestTask | UniApp.GeneralCallbackResult | string> => {

    if (option.baseURL && !isAbsoluteURL(option.url)) {
        option.url = combineURLs(option.baseURL, option.url);
    }
    option.data = option.transformRequest && option.transformRequest(option.data);

    return new Promise((resolve, reject: (err: UniApp.GeneralCallbackResult) => void) => {
        const requestTask = uni.request({
            url: option.url,
            data: option.data || {},
            header: option.header,
            method: option.method,
            dataType: option.dataType,
            success(res) { resolve(option.transformResponse && option.transformResponse(res)) },
            fail(err) { reject(err) },
            complete(res) { option.complete && option.complete(res) }
        });

        if (option.timeout && +option.timeout > 1000) {
            setTimeout(() => {
                requestTask.abort();
                resolve('request timeout');
            }, option.timeout)
        }
    });
}


class InterceptorManager {
    handlers: Array<{ fulfilled: (res: any) => void, rejected?: (err: UniApp.GeneralCallbackResult) => void } | null>;
    constructor() {
        this.handlers = [];
    }

    use<T>(fulfilled: (res: T) => void, rejected?: (err: UniApp.GeneralCallbackResult) => void): number {
        this.handlers.push({ fulfilled, rejected });
        return this.handlers.length - 1;
    }

    eject(id: number): void {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    }

    forEach(fn: (e: { fulfilled: (res: any) => void, rejected?: (err: UniApp.GeneralCallbackResult) => void }) => void): void {
        this.handlers.forEach(e => e && fn(e))
    }
}

class Request {
    defaults: Options;
    interceptors: {
        request: InterceptorManager,
        response: InterceptorManager
    };
    [method: string]: any;
    constructor(option: Options) {
        this.defaults = option;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };

        methods.forEach(method =>
            (this[method.toLowerCase()] =
                (url: string, data: { [key: string]: any }, options: RequestOptions = {}): Promise<any> =>
                    this.request(url, { method, data, ...options }))
        );
    }
    request(url: string, option: RequestOptions): Promise<any> {

        const params = deepMerge(this.defaults, option, { url });

        let chain: any[] = [dispatchRequest, null];
        let promise = Promise.resolve(params);


        this.interceptors.request.forEach((interceptor: { fulfilled: (res: Options) => void }) => {
            chain.unshift(interceptor.fulfilled, null);
        });

        this.interceptors.response.forEach((interceptor: {
            fulfilled: (res: UniApp.RequestSuccessCallbackResult) => void, rejected?: (err: UniApp.GeneralCallbackResult) => void
        }) => {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });

        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
    }
}


const createInstance = (option: Options): any => {
    let context = new Request(option);
    let instance = bind(Request.prototype.request, context);

    extend(instance, Request.prototype, context);
    extend(instance, context);

    return instance;
}

type RequestReturnValue = UniApp.RequestSuccessCallbackResult | UniApp.RequestTask | UniApp.GeneralCallbackResult | string;

interface RequestReturn<
    T = RequestReturnValue,
    U = { [key: string]: any }
    > {
    (url?: string, data?: U, option?: RequestOptions): Promise<T>
}
export interface RequestInstance<T = RequestReturnValue> extends RequestReturn<RequestReturnValue, RequestOptions> {
    defaults: Options,
    interceptors: {
        request: InterceptorManager,
        response: InterceptorManager
    },
    get: RequestReturn<T>,
    post: RequestReturn<T>,
    put: RequestReturn<T>,
    delete: RequestReturn<T>,
    options: RequestReturn<T>,
    head: RequestReturn<T>,
    trace: RequestReturn<T>,
    connect: RequestReturn<T>,
    [props: string]: any
}
const request: RequestInstance = createInstance(defaults);

// 用于创建多个实例
request.create = (option: any) => createInstance(merge(defaults, option));

// 并发请求数据处理
request.spread = (callback: any) => (...arg: any) => callback.apply(null, [...arg]);

export default request;

