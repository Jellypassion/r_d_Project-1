import { AddFavouriteRequest, AddFavouriteResponse, FavouriteDto } from "src/models/the-cat-api/favourite.dto";
import { IApiService } from "src/services/abstractions/i-api-service";

export class FavouritesApi {
    public constructor(private readonly apiService: IApiService<Response>) {}

    public async addFavourite(imageId: string, subId?: string): Promise<[Response, AddFavouriteResponse]> {
        const body: AddFavouriteRequest = { image_id: imageId };
        if (subId) body.sub_id = subId;

        const response = await this.apiService.post('/favourites', body);
        const json = await response.json() as AddFavouriteResponse;
        return [response, json];
    }

    public async getFavourites(): Promise<[Response, FavouriteDto[]]> {
        const response = await this.apiService.get('/favourites');
        const json = await response.json() as FavouriteDto[];
        return [response, json];
    }

}
