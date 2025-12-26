import { IApiService } from './abstractions/i-api-service';
import { TokenRefreshService } from './token-refresh.service';
import { ITokenStorage } from './token-storage';

export class FetchApiService implements IApiService<Response> {
    private tokenRefreshService?: TokenRefreshService;
    private tokenStorage?: ITokenStorage;

    public constructor(
        private readonly baseUrl: string,
        private readonly secret: {
            apiKey?: string;
            basicToken?: string;
            bearerToken?: string;
            cookies?: Record<string, string>;
        },
        tokenStorage?: ITokenStorage
    ) {
        if (tokenStorage) {
            this.tokenStorage = tokenStorage;
            this.tokenRefreshService = new TokenRefreshService(baseUrl, tokenStorage);
        }
    }

    public async get(uri: string, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Promise<Response> {
        return await this.fetchWithRetry(async () => {
            const defaultHeaders = this.getDefaultHeaders(headers);
            const queries = params ? '?' + Object.entries(params || {}).map(([key, value]) => `${key}=${value}`).join('&') : '';
            const url = `${this.baseUrl}${uri}${queries}`;
            return await fetch(url, {
                method: 'GET',
                headers: defaultHeaders,
                credentials: 'include'
            });
        });
    }
    public async post(uri: string, body: unknown, headers?: Record<string, string>): Promise<Response> {
        return await this.fetchWithRetry(async () => {
            const defaultHeaders = this.getDefaultHeaders(headers);

            return await fetch(`${this.baseUrl}${uri}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: defaultHeaders,
                credentials: 'include'
            });
        });
    }
    public async postForm(uri: string, formData: FormData, headers?: Record<string, string>): Promise<Response> {
        return await this.fetchWithRetry(async () => {
            const defaultHeaders = this.getDefaultHeadersForPostForm(headers);

            return await fetch(`${this.baseUrl}${uri}`, {
                method: 'POST',
                body: formData,
                headers: defaultHeaders,
                credentials: 'include'
            });
        });
    }
    public async put(uri: string, body: unknown, headers?: Record<string, string>): Promise<Response> {
        return await this.fetchWithRetry(async () => {
            const defaultHeaders = this.getDefaultHeaders(headers);

            return await fetch(`${this.baseUrl}${uri}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: defaultHeaders,
                credentials: 'include'
            });
        });
    }

    private getDefaultHeaders(headers?: Record<string, string>): Record<string, string> {
        return {
            ...this.getAuthHeaders(),
            ...headers,
            ...{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        };
    }

    private getDefaultHeadersForPostForm(headers?: Record<string, string>): Record<string, string> {
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
        } else if (this.tokenStorage) {
            // Use token storage if available (for dynamic cookie updates)
            const cookies = this.tokenStorage.getAllCookies();
            const cookieString = Object.entries(cookies)
                .map(([key, value]) => `${key}=${value}`)
                .join('; ');
            headers['Cookie'] = cookieString;
        } else if (this.secret.cookies) {
            // Fallback to static cookies
            const cookieString = Object.entries(this.secret.cookies)
                .map(([key, value]) => `${key}=${value}`)
                .join('; ');
            headers['Cookie'] = cookieString;
        }

        return headers;
    }

    /**
     * Wrapper for fetch that automatically refreshes tokens on expiration
     */
    private async fetchWithRetry(
        fetchFunction: () => Promise<Response>,
        retryCount = 0
    ): Promise<Response> {
        const response = await fetchFunction();

        // Check if token refresh is enabled and token is expired
        if (
            this.tokenRefreshService &&
            TokenRefreshService.isTokenExpired(response) &&
            retryCount === 0
        ) {
            // Refresh tokens
            await this.tokenRefreshService.refreshTokens();

            // Retry the request with new tokens
            return await this.fetchWithRetry(fetchFunction, retryCount + 1);
        }

        return response;
    }
}
