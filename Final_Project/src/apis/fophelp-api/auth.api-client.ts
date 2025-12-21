import { IApiService } from 'src/services/abstractions/i-api-service';
import { LoginResponseDto } from 'src/models/fophelp-api/auth.dto';
import { LoginService } from '../../services/login.service';

/**
 * API client for authentication operations
 */
export class AuthApiClient {
    private loginService: LoginService;

    public constructor(
        private readonly apiService: IApiService<unknown>,
        private readonly baseUrl: string
    ) {
        this.loginService = new LoginService(baseUrl);
    }

    /**
     * Login with username and password
     * @param username User email
     * @param password User password
     * @returns Promise with authentication tokens
     */
    public async login(username: string, password: string): Promise<LoginResponseDto> {
        return await this.loginService.login(username, password);
    }

    /**
     * Login and automatically update .env file with new tokens
     * @param username User email
     * @param password User password
     * @param envPath Optional custom path to .env file
     * @returns Promise with authentication tokens
     */
    public async loginAndUpdateEnv(
        username: string,
        password: string,
        envPath?: string
    ): Promise<LoginResponseDto> {
        return await this.loginService.loginAndUpdateEnv(username, password, envPath);
    }

    /**
     * Login using credentials from environment variables
     * Reads API_USERNAME and API_PASSWORD from process.env
     * @param updateEnv If true, updates .env file with new tokens
     * @returns Promise with authentication tokens
     */
    public async loginFromEnv(updateEnv: boolean = false): Promise<LoginResponseDto> {
        const username = process.env.API_USERNAME;
        const password = process.env.API_PASSWORD;

        if (!username || !password) {
            throw new Error('API_USERNAME and API_PASSWORD must be set in .env file');
        }

        if (updateEnv) {
            return await this.loginService.loginAndUpdateEnv(username, password);
        }

        return await this.loginService.login(username, password);
    }
}
