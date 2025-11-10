import { IApiService } from './abstractions/i-api-service';

export class FetchApiService implements IApiService<Response> {
    public constructor(
        private readonly baseUrl: string,
        private readonly secret: {
            apiKey?: string;
            basicToken?: string;
            bearerToken?: string;
        }
    ) {}

    public async get(uri: string, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Promise<Response> {
        const defaultHeaders = this.getDefaultHeaders(headers);
        const queries = params ? '?' + Object.entries(params || {}).map(([key, value]) => `${key}=${value}`).join('&') : '';
        const url = `${this.baseUrl}${uri}${queries}`;
        return await fetch(url, {
            method: 'GET',
            headers: defaultHeaders
        });
    }
    public async post(uri: string, body: unknown, headers?: Record<string, string>): Promise<Response> {
        const defaultHeaders = this.getDefaultHeaders(headers);

        return await fetch(`${this.baseUrl}${uri}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: defaultHeaders
        });
    }
    public async postForm(uri: string, formData: FormData, headers?: Record<string, string>): Promise<Response> {
        const defaultHeaders = this.getDefaultHeaders(headers);

        return await fetch(`${this.baseUrl}${uri}`, {
            method: 'POST',
            body: formData,
            headers: defaultHeaders
        });
    }
    public async put(uri: string, body: unknown, headers?: Record<string, string>): Promise<Response> {
        const defaultHeaders = this.getDefaultHeaders(headers);

        return await fetch(`${this.baseUrl}${uri}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: defaultHeaders
        });
    }

    private getDefaultHeaders(headers?: Record<string, string>): Record<string, string> {
        return {
            ...this.getAuthHeaders(),
            ...headers,
            ...{
                Accept: 'application/json'
            }
        };
    }

    private getAuthHeaders(): Record<string, string> {
        const headers: Record<string, string> = {};
        if (this.secret.apiKey) {
            headers['x-api-key'] = this.secret.apiKey;
        } else if (this.secret.basicToken) {
            headers['Authorization'] = `Basic ${this.secret.basicToken}`;
        } else if (this.secret.bearerToken) {
            headers['Authorization'] = `Bearer ${this.secret.bearerToken}`;
        }

        return headers;
    }
}
