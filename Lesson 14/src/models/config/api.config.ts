export interface ConfigDto {
    auth: AuthConfigDto;
    api: ApiConfigDto;
}

export interface AuthConfigDto {
    theCatsApi?: TheCatsApiAuthConfigDto;
}

export interface ApiConfigDto {
    theCatsApi: TheCatsApiConfigDto;
}

export interface TheCatsApiAuthConfigDto {
    apiKey?: string;
}

export interface TheCatsApiConfigDto {
    baseUrl: string;
}
