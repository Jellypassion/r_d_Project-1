import { ITokenStorage } from './token-storage';

/**
 * Service responsible for refreshing authentication tokens
 */
export class TokenRefreshService {
    private isRefreshing = false;
    private refreshPromise: Promise<void> | null = null;

    public constructor(
        private readonly baseUrl: string,
        private readonly tokenStorage: ITokenStorage
    ) {}

    /**
     * Refresh the authentication tokens by calling the refresh endpoint
     * @returns Promise that resolves when tokens are refreshed
     */
    public async refreshTokens(): Promise<void> {
        // If already refreshing, wait for that refresh to complete
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }

        this.isRefreshing = true;
        this.refreshPromise = this.performRefresh();

        try {
            await this.refreshPromise;
        } finally {
            this.isRefreshing = false;
            this.refreshPromise = null;
        }
    }

    /**
     * Perform the actual token refresh
     */
    private async performRefresh(): Promise<void> {
        const cookies = this.tokenStorage.getAllCookies();
        const cookieString = Object.entries(cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');

        const response = await fetch(`${this.baseUrl}/api/react/authenticate/refresh`, {
            method: 'GET',
            headers: {
                'Cookie': cookieString,
                'Accept': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
        }

        // Parse Set-Cookie headers and update tokens
        const newTokens = this.parseSetCookieHeaders(response.headers);
        this.tokenStorage.updateTokens(newTokens);
    }

    /**
     * Parse Set-Cookie headers to extract token values
     * @param headers Response headers
     * @returns Object with new token values
     */
    private parseSetCookieHeaders(headers: Headers): {
        accessToken?: string;
        refreshToken?: string;
        username?: string;
        refreshExpires?: string;
        sessionUser?: string;
    } {
        const tokens: Record<string, string> = {};

        // Get all Set-Cookie headers
        const setCookieHeaders = headers.get('set-cookie');
        if (!setCookieHeaders) {
            // Try to get them one by one (some implementations)
            const cookieMap = {
                'X-Access-Token': 'accessToken',
                'X-Refresh-Token': 'refreshToken',
                'X-Username': 'username',
                'X-Refresh-Expires': 'refreshExpires',
                'Session-User': 'sessionUser'
            };

            // In browsers, we can't access Set-Cookie directly for security reasons
            // We'll need to parse the raw header string if available
            // For now, we'll try a different approach
            for (const [cookieName, tokenKey] of Object.entries(cookieMap)) {
                const value = this.extractCookieValue(headers, cookieName);
                if (value) {
                    tokens[tokenKey] = value;
                }
            }
        } else {
            // Parse multiple Set-Cookie headers (Node.js environment)
            const cookieLines = setCookieHeaders.split(',');
            for (const line of cookieLines) {
                const parsed = this.parseSingleSetCookie(line);
                if (parsed) {
                    tokens[parsed.key] = parsed.value;
                }
            }
        }

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            username: tokens.username,
            refreshExpires: tokens.refreshExpires,
            sessionUser: tokens.sessionUser
        };
    }

    /**
     * Parse a single Set-Cookie header line
     */
    private parseSingleSetCookie(line: string): { key: string; value: string } | null {
        const match = line.match(/^([^=]+)=([^;]+)/);
        if (!match) return null;

        const name = match[1].trim();
        const value = match[2].trim();

        const keyMap: Record<string, string> = {
            'X-Access-Token': 'accessToken',
            'X-Refresh-Token': 'refreshToken',
            'X-Username': 'username',
            'X-Refresh-Expires': 'refreshExpires',
            'Session-User': 'sessionUser'
        };

        const key = keyMap[name];
        if (!key) return null;

        return { key, value };
    }

    /**
     * Try to extract cookie value from raw header string
     */
    private extractCookieValue(headers: Headers, cookieName: string): string | null {
        // This is a fallback method - in practice, getting Set-Cookie in browser is restricted
        const rawHeader = headers.get('set-cookie') || '';
        const regex = new RegExp(`${cookieName}=([^;]+)`);
        const match = rawHeader.match(regex);
        return match ? match[1] : null;
    }

    /**
     * Check if response indicates token expiration
     */
    public static isTokenExpired(response: Response): boolean {
        // Check for Token-Expired header
        const tokenExpired = response.headers.get('Token-Expired');
        if (tokenExpired === 'true') {
            return true;
        }

        // Check for 401 Unauthorized
        if (response.status === 401) {
            return true;
        }

        // Check for 403 Forbidden (might indicate expired token)
        if (response.status === 403) {
            return true;
        }

        return false;
    }
}
