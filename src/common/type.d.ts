
export interface Response {
    code: number,
    msg: string,
    data: any,
    [key: string]: any
}

export interface Pager<T> {
    nextPage: number
    list: Array<T>
}