import { CatVoteDto, CreateVoteRequest, CreateVoteResponse } from 'src/models/the-cat-api/vote.dto';
import { IApiService } from 'src/services/abstractions/i-api-service';

export class VotesApi {
    public constructor(private readonly apiService: IApiService<Response>) {}

    public async createVote(imageId: string, value: number, subId?: string): Promise<[Response, CreateVoteResponse]> {
        const body: CreateVoteRequest = { image_id: imageId, value: value};
        if (subId) body.sub_id = subId;

        const response = await this.apiService.post('/votes', body);
        const json = await response.json() as CreateVoteResponse;
        return [response, json];
    }

    public async getVotes(): Promise<[Response, CatVoteDto[]]> {
        const response = await this.apiService.get('/votes');
        const json = await response.json() as CatVoteDto[];
        return [response, json];
    }
}
