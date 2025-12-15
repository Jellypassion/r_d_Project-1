export interface ConfigDto {
    auth: AuthConfigDto;
    api: ApiConfigDto;
}

export interface AuthConfigDto {
    fophelpApi?: FophelpApiAuthConfigDto;
}

export interface ApiConfigDto {
    fophelpApi: FophelpApiConfigDto;
}

export interface FophelpApiAuthConfigDto {
    cookies: {
        xAccessToken: string;
        xRefreshToken: string;
        xUsername: string;
        xRefreshExpires: string;
        sessionUser: string;
    };
}

export interface FophelpApiConfigDto {
    baseUrl: string;
}
