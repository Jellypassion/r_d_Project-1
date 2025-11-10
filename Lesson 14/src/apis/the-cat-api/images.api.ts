import { ImageDto } from "src/models/the-cat-api/image.dto";
import { IApiService } from "src/services/abstractions/i-api-service";
import * as fs from "fs";


export class CatImagesApi {
    public constructor(private readonly apiService: IApiService<Response>) {}

    public async uploadImage(imagePath: string, subId?: string, breeds?: string[]): Promise<[Response, ImageDto]> {
        const formData = new FormData();
        const imageFile = fs.readFileSync(imagePath);
        const binaryFile = new File([new Uint8Array(imageFile)], 'cat-3.jpg', { type: 'image/jpeg' });

        formData.append('file', binaryFile);
        subId && formData.append('sub_id', subId);
        breeds && formData.append('breeds', breeds.join(','));

        const response = await this.apiService.postForm('/images/upload', formData);
        const imageResponse = await response.json();
        return [response, imageResponse];
    }

    public async getMyImages(): Promise<[Response, ImageDto[]]> {
        const response = await this.apiService.get('/images');
        const imagesResponse = await response.json();
        return [response, imagesResponse];
    }
}
