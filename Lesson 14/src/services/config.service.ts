import * as dotenv from 'dotenv';
import { ApiConfigDto, AuthConfigDto, ConfigDto } from 'src/models/config/api.config';

export class ConfigService {
    public constructor() {
        dotenv.config();
    }

    public getConfig(): ConfigDto {
        return {
            auth: this.getAuthConfig(),
            api: this.getApiConfig()
        };
    }

    private getAuthConfig(): AuthConfigDto {
        return {
            theCatsApi: {
                apiKey: process.env.CAT_API_KEY ? process.env.CAT_API_KEY : ''
            }
        };
    }

    private getApiConfig(): ApiConfigDto {
        return {
            theCatsApi: {
                baseUrl: 'https://api.thecatapi.com/v1'
            }
        };
    }
}
