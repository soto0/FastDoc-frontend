export interface IRoot<T> {
    payload: T;
    meta: IMeta;
}

interface IMeta {
    success: boolean;
    hasMore?: boolean;
}
