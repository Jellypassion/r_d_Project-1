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
            fophelpApi: {
                cookies: {
                    xAccessToken: process.env.X_ACCESS_TOKEN || '',
                    xRefreshToken: process.env.X_REFRESH_TOKEN || '',
                    xUsername: process.env.X_USERNAME || '',
                    xRefreshExpires: process.env.X_REFRESH_EXPIRES || '',
                    sessionUser: process.env.SESSION_USER || ''
                }
            }
        };
    }

    private getApiConfig(): ApiConfigDto {
        return {
            fophelpApi: {
                baseUrl: process.env.FOPHELP_BASE_URL || 'https://new.fophelp.pro'
            }
        };
    }
}
