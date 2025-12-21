/**
 * Login request DTO
 */
export interface LoginRequestDto {
    username: string;
    password: string;
}

/**
 * Login response DTO with authentication tokens
 */
export interface LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    username: string;
    refreshExpires: string;
    sessionUser: string;
}
