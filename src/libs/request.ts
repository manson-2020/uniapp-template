
import { isAbsoluteURL, combineURLs, bind, extend } from "./utils";

export interface RequestOptions {
    /**
     * 资源url
     */
    url?: string,
    baseURL?: string;
    /**
     * 请求的参数
     */
    data?: AnyObject;
    /**
     * 设置请求的 header，header 中不能设置 Referer。
     */
    header?: any;
    /**
     * 默认为 GET
     * 可以是：OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT
     */
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
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

type Method = string & RequestOptions["method"];

const methods: Method[] = ["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT"];

class InterceptorManager {
    protected handlers: Array<{ fulfilled: (res: any) => void, rejected?: (err: UniApp.GeneralCallbackResult) => void } | null>;
    constructor() {
        this.handlers = [];
    }

    public use<T>(fulfilled: (res: T) => void, rejected?: (err: UniApp.GeneralCallbackResult) => void): number {
        this.handlers.push({ fulfilled, rejected });
        return this.handlers.length - 1;
    }

    public eject(id: number): void {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    }

    public forEach(fn: (e: { fulfilled: (res: any) => void, rejected?: (err: UniApp.GeneralCallbackResult) => void }) => void): void {
        this.handlers.forEach(e => e && fn(e))
    }
}

class Request {

    [method: string]: any;

    protected interceptors: {
        request: InterceptorManager,
        response: InterceptorManager
    };

    constructor(public defaults: RequestOptions = {}) {
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };
        methods.forEach((method: Method) => (
            this[method.toLowerCase()] = (
                url: string,
                data: AnyObject,
                options: RequestOptions = {}
            ) => this.request({ ...options, url, data, method })
        ));
    }

    public request(options: RequestOptions) {

        let [chain, promise]: [any[], Promise<any>] = [
            [this.dispatch.bind(this), null],
            Promise.resolve(Object.assign(this.defaults, options))
        ];

        this.interceptors.request.forEach((interceptor: { fulfilled: (res: RequestOptions) => void }) => {
            chain.unshift(interceptor.fulfilled, null);
        });

        this.interceptors.response.forEach((interceptor: {
            fulfilled: (res: UniApp.RequestSuccessCallbackResult) => void,
            rejected?: (err: UniApp.GeneralCallbackResult) => void
        }) => {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });

        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
    }

    private dispatch(params: RequestOptions) {

        (["success", "fail"] as ("success" | "fail")[]).forEach(item => {
            params[item] && delete params[item];
        });

        if (this.defaults.baseURL && !isAbsoluteURL(params.url)) {
            params.url = combineURLs(this.defaults.baseURL, params.url);
        }

        return new Promise((resolve, reject) => {
            const requestTask = uni.request({
                url: params.url as string,
                ...params,
                success: res => resolve(res),
                fail: err => reject(err),
                complete(res) { params.complete && params.complete(res) },
            });

            params.timeout && setTimeout(() => {
                requestTask.abort();
                resolve("request timeout");
            }, +params.timeout)
        })
    }
}

type RequestMethod = 'options' | 'get' | 'head' | 'post' | 'put' | 'delete' | 'trace' | 'connect';
type RequestReturn<T> = (url?: string, data?: AnyObject, options?: RequestOptions) => Promise<T>

export interface RequestInstance<T> extends Record<RequestMethod, RequestReturn<T>> {
    (options: RequestOptions): Promise<T>
    defaults: RequestOptions,
    interceptors: {
        request: InterceptorManager,
        response: InterceptorManager
    },
    [property: string]: any
}

const createInstance = (requestOptions: RequestOptions): any => {
    let context = new Request(requestOptions),
        instance = bind(Request.prototype.request, context);

    extend(instance, Request.prototype, context);
    extend(instance, context);

    return instance;
}

const defaults = {
    baseURL: "",
    dataType: "json",
    header: {},
    responseType: "text",
    // timeout: 1000
}

const request: RequestInstance<any> = createInstance(defaults);

// 用于创建多个实例
request.create = (options: AnyObject) => createInstance(Object.assign(defaults, options));

// 并发请求数据处理
request.spread = (callback: Function) => (...arg: AnyArray) => callback.apply(null, arg);

export default request;
