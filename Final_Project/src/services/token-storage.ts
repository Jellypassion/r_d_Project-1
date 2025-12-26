/**
 * Interface for managing authentication tokens
 */
export interface ITokenStorage {
    getAccessToken(): string;
    getRefreshToken(): string;
    getUsername(): string;
    getRefreshExpires(): string;
    getSessionUser(): string;

    updateTokens(tokens: {
        accessToken?: string;
        refreshToken?: string;
        username?: string;
        refreshExpires?: string;
        sessionUser?: string;
    }): void;

    getAllCookies(): Record<string, string>;
}

/**
 * In-memory token storage implementation
 */
export class TokenStorage implements ITokenStorage {
    private tokens: {
        accessToken: string;
        refreshToken: string;
        username: string;
        refreshExpires: string;
        sessionUser: string;
    };

    public constructor(initialTokens: {
        accessToken: string;
        refreshToken: string;
        username: string;
        refreshExpires: string;
        sessionUser: string;
    }) {
        this.tokens = { ...initialTokens };
    }

    public getAccessToken(): string {
        return this.tokens.accessToken;
    }

    public getRefreshToken(): string {
        return this.tokens.refreshToken;
    }

    public getUsername(): string {
        return this.tokens.username;
    }

    public getRefreshExpires(): string {
        return this.tokens.refreshExpires;
    }

    public getSessionUser(): string {
        return this.tokens.sessionUser;
    }

    public updateTokens(tokens: {
        accessToken?: string;
        refreshToken?: string;
        username?: string;
        refreshExpires?: string;
        sessionUser?: string;
    }): void {
        if (tokens.accessToken !== undefined) {
            this.tokens.accessToken = tokens.accessToken;
        }
        if (tokens.refreshToken !== undefined) {
            this.tokens.refreshToken = tokens.refreshToken;
        }
        if (tokens.username !== undefined) {
            this.tokens.username = tokens.username;
        }
        if (tokens.refreshExpires !== undefined) {
            this.tokens.refreshExpires = tokens.refreshExpires;
        }
        if (tokens.sessionUser !== undefined) {
            this.tokens.sessionUser = tokens.sessionUser;
        }
    }

    public getAllCookies(): Record<string, string> {
        return {
            'X-Access-Token': this.tokens.accessToken,
            'X-Refresh-Token': this.tokens.refreshToken,
            'X-Username': this.tokens.username,
            'X-Refresh-Expires': this.tokens.refreshExpires,
            'Session-User': this.tokens.sessionUser
        };
    }
}
