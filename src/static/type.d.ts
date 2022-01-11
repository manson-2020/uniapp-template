import { InterceptorManager } from "./libs/request";

export type RequestOptions = Partial<UniApp.RequestOptions> & { baseURL?: string };
export type RequestMethod = 'options' | 'get' | 'head' | 'post' | 'put' | 'delete' | 'trace' | 'connect';
export type RequestFunction<T> = (url?: string, data?: AnyObject, options?: RequestOptions) => Promise<T>;

export interface RequestInstance<T> extends Record<RequestMethod, RequestFunction<T>> {
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