export interface IApiService<T> {
    get(uri: string, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Promise<T>;
    post(uri: string, body: unknown, headers?: Record<string, string>): Promise<T>;
    postForm(uri: string, formData: FormData, headers?: Record<string, string>): Promise<T>;
    put(uri: string, body: unknown, headers?: Record<string, string>): Promise<T>;
}
