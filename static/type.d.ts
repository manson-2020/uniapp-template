import { InterceptorManager } from "@/libs/request";

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
export type RequestMethod = 'options' | 'get' | 'head' | 'post' | 'put' | 'delete' | 'trace' | 'connect';
export type RequestReturn<T> = (url?: string, data?: AnyObject, options?: RequestOptions) => Promise<T>

export interface RequestInstance<T> extends Record<RequestMethod, RequestReturn<T>> {
    (options: RequestOptions): Promise<T>
    defaults: RequestOptions,
    interceptors: {
        request: InterceptorManager,
        response: InterceptorManager
    },
    [property: string]: any
}

export interface Response {
    code: number
    msg: string
    data: any
    [key: string]: any
}

export interface Pager<T> {
    page: number
    list: Array<T>
    size: number
}

declare module "vue/types/vue" {
    interface Vue {
        $request: RequestInstance<Response>;
        $config: object
    }
}

