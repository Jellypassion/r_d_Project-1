import { ConfigService } from '../services/config.service';
import { FetchApiService } from '../services/fetch-api-service';
// import { ExampleApi } from '../apis/fophelp-api/example.api';
import { TokenStorage } from '../services/token-storage';
import { IncomesApiClient } from '../apis/fophelp-api/incomes.api-client';
import { TaxesApiClient } from '../apis/fophelp-api/taxes.api-client';

/**
 * Helper class to initialize and provide access to Fophelp API clients
 */
export class FophelpApiClient {
    private readonly apiService: FetchApiService;
    private readonly tokenStorage: TokenStorage;

    // public readonly exampleApi: ExampleApi;
    public readonly incomesApi: IncomesApiClient;
    public readonly taxesApi: TaxesApiClient;

    public constructor() {
        const configService = new ConfigService();
        const config = configService.getConfig();

        // Initialize token storage with current tokens
        if (!config.auth.fophelpApi?.cookies) {
            throw new Error('Fophelp API authentication cookies are not configured');
        }

        const cookieConfig = config.auth.fophelpApi.cookies;
        this.tokenStorage = new TokenStorage({
            accessToken: cookieConfig.xAccessToken,
            refreshToken: cookieConfig.xRefreshToken,
            username: cookieConfig.xUsername,
            refreshExpires: cookieConfig.xRefreshExpires,
            sessionUser: cookieConfig.sessionUser
        });

        // Initialize API service with token storage for automatic refresh
        this.apiService = new FetchApiService(
            config.api.fophelpApi.baseUrl,
            {}, // Empty secret object, using token storage instead
            this.tokenStorage
        );

        // Initialize API clients
        // this.exampleApi = new ExampleApi(this.apiService);
        this.incomesApi = new IncomesApiClient(this.apiService, process.env.FOPHELP_API_VERSION || '/api/v2.0');
        this.taxesApi = new TaxesApiClient(this.apiService, process.env.FOPHELP_API_VERSION || '/api/v2.0');
    }

    /**
     * Get the underlying API service for custom requests
     */
    public getApiService(): FetchApiService {
        return this.apiService;
    }

    /**
     * Get the token storage to check current token values
     */
    public getTokenStorage(): TokenStorage {
        return this.tokenStorage;
    }
}
