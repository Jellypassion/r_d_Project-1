import { IApiService } from '../../services/abstractions/i-api-service';
import { TaxesDto } from '../../models/fophelp-api/taxes.dto';

export class TaxServiceClient {
    public constructor(
        private readonly apiService: IApiService<Response>,
        private readonly apiVersion = '/api/v2.0'
    ) {}

    public async getTaxes(): Promise<[Response, TaxesDto[]]> {
        const response = await this.apiService.get(`${this.apiVersion}/taxes`);
        const taxesResponse = await response.json() as TaxesDto[];
        return [response, taxesResponse];
    }
}
