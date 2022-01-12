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