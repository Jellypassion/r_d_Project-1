import { ITokenStorage } from './token-storage';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Response from login endpoint
 */
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    username: string;
    refreshExpires: string;
    sessionUser: string;
}

/**
 * Service responsible for authentication and token management
 */
export class LoginService {
    public constructor(
        private readonly baseUrl: string,
        private readonly tokenStorage?: ITokenStorage
    ) {}

    /**
     * Login with username and password
     * @param username User email
     * @param password User password
     * @returns Promise with parsed tokens
     */
    public async login(username: string, password: string): Promise<LoginResponse> {
        const response = await fetch(`${this.baseUrl}/api/react/authenticate/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }

        // Parse Set-Cookie headers to extract tokens
        const tokens = this.parseSetCookieHeaders(response.headers);

        // Update token storage if provided
        if (this.tokenStorage) {
            this.tokenStorage.updateTokens({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                username: tokens.username,
                refreshExpires: tokens.refreshExpires,
                sessionUser: tokens.sessionUser
            });
        }

        return tokens;
    }

    /**
     * Login and update .env file with new tokens
     * @param username User email
     * @param password User password
     * @param envPath Path to .env file (defaults to project root)
     */
    public async loginAndUpdateEnv(
        username: string,
        password: string,
        envPath?: string
    ): Promise<LoginResponse> {
        const tokens = await this.login(username, password);

        // Update .env file
        const envFilePath = envPath || path.join(process.cwd(), '.env');
        this.updateEnvFile(envFilePath, tokens);

        return tokens;
    }

    /**
     * Parse Set-Cookie headers to extract token values
     * @param headers Response headers
     * @returns Object with token values
     */
    private parseSetCookieHeaders(headers: Headers): LoginResponse {
        const tokens: Partial<LoginResponse> = {};

        const cookieMap: Record<string, keyof LoginResponse> = {
            'X-Access-Token': 'accessToken',
            'X-Refresh-Token': 'refreshToken',
            'X-Username': 'username',
            'X-Refresh-Expires': 'refreshExpires',
            'Session-User': 'sessionUser'
        };

        // Try to get set-cookie header
        // In Node.js with node-fetch or native fetch, we can access set-cookie
        const setCookieHeader = headers.get('set-cookie');

        if (setCookieHeader) {
            // Parse multiple Set-Cookie headers
            const cookieLines = setCookieHeader.split(/,(?=\s*\w+\s*=)/);

            for (const line of cookieLines) {
                for (const [cookieName, tokenKey] of Object.entries(cookieMap)) {
                    if (line.includes(`${cookieName}=`)) {
                        const value = this.extractCookieValue(line, cookieName);
                        if (value) {
                            tokens[tokenKey] = value;
                        }
                    }
                }
            }
        } else {
            // Fallback: try to extract from individual cookie headers
            for (const [cookieName, tokenKey] of Object.entries(cookieMap)) {
                const value = this.extractCookieFromHeaders(headers, cookieName);
                if (value) {
                    tokens[tokenKey] = value;
                }
            }
        }

        // Validate that all required tokens are present
        const requiredFields: (keyof LoginResponse)[] = [
            'accessToken', 'refreshToken', 'username', 'refreshExpires', 'sessionUser'
        ];

        for (const field of requiredFields) {
            if (!tokens[field]) {
                throw new Error(`Missing required token: ${field}`);
            }
        }

        return tokens as LoginResponse;
    }

    /**
     * Extract cookie value from a Set-Cookie header line
     * @param cookieLine Single Set-Cookie header line
     * @param cookieName Name of the cookie to extract
     * @returns Cookie value or null
     */
    private extractCookieValue(cookieLine: string, cookieName: string): string | null {
        const regex = new RegExp(`${cookieName}=([^;]+)`);
        const match = cookieLine.match(regex);
        return match ? match[1].trim() : null;
    }

    /**
     * Try to extract cookie from headers object
     * @param headers Response headers
     * @param cookieName Name of the cookie to extract
     * @returns Cookie value or null
     */
    private extractCookieFromHeaders(headers: Headers, cookieName: string): string | null {
        // Some implementations may provide headers separately
        let result: string | null = null;
        headers.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie' && value.includes(cookieName)) {
                result = this.extractCookieValue(value, cookieName);
            }
        });
        return result;
    }

    /**
     * Update .env file with new token values
     * @param envPath Path to .env file
     * @param tokens Token values to write
     */
    private updateEnvFile(envPath: string, tokens: LoginResponse): void {
        if (!fs.existsSync(envPath)) {
            throw new Error(`Environment file not found: ${envPath}`);
        }

        let envContent = fs.readFileSync(envPath, 'utf-8');

        // Update each token value
        const tokenMap: Record<string, string> = {
            'X_ACCESS_TOKEN': tokens.accessToken,
            'X_REFRESH_TOKEN': tokens.refreshToken,
            'X_USERNAME': tokens.username,
            'X_REFRESH_EXPIRES': tokens.refreshExpires,
            'SESSION_USER': tokens.sessionUser
        };

        for (const [envKey, value] of Object.entries(tokenMap)) {
            const regex = new RegExp(`^${envKey}=.*$`, 'm');
            if (regex.test(envContent)) {
                // Update existing value
                envContent = envContent.replace(regex, `${envKey}=${value}`);
            } else {
                // Add new value
                envContent += `\n${envKey}=${value}`;
            }
        }

        fs.writeFileSync(envPath, envContent, 'utf-8');
    }

    /**
     * Static helper to update .env file without creating a service instance
     * @param envPath Path to .env file
     * @param tokens Token values to write
     */
    public static updateEnvFile(envPath: string, tokens: LoginResponse): void {
        const service = new LoginService('');
        service['updateEnvFile'](envPath, tokens);
    }
}
