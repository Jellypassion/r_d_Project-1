import { FetchApiService } from '../../services/fetch-api-service';
import { CreateExampleDto, ExampleDto, UpdateExampleDto } from '../../models/fophelp-api/example.dto';

export class ExampleApi {
    public constructor(private readonly apiService: FetchApiService) {}

    public async getAll(): Promise<ExampleDto[]> {
        const response = await this.apiService.get('/api/examples');
        if (!response.ok) {
            throw new Error(`Failed to fetch examples: ${response.statusText}`);
        }
        return await response.json();
    }

    public async getById(id: string): Promise<ExampleDto> {
        const response = await this.apiService.get(`/api/examples/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch example: ${response.statusText}`);
        }
        return await response.json();
    }

    public async create(data: CreateExampleDto): Promise<ExampleDto> {
        const response = await this.apiService.post('/api/examples', data);
        if (!response.ok) {
            throw new Error(`Failed to create example: ${response.statusText}`);
        }
        return await response.json();
    }

    public async update(id: string, data: UpdateExampleDto): Promise<ExampleDto> {
        const response = await this.apiService.put(`/api/examples/${id}`, data);
        if (!response.ok) {
            throw new Error(`Failed to update example: ${response.statusText}`);
        }
        return await response.json();
    }

    public async delete(id: string): Promise<void> {
        const response = await this.apiService.get(`/api/examples/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to delete example: ${response.statusText}`);
        }
    }
}
