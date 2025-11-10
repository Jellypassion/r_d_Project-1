import { describe, expect, test } from 'vitest';
import { ConfigService } from '../src/services/config.service';
import { FetchApiService } from '../src/services/fetch-api-service';
import { CatImagesApi } from '../src/apis/the-cat-api/images.api';
import { ImageDto } from '../src/models/the-cat-api/image.dto';


describe('Cats API integration tests', () => {
    const config = (new ConfigService()).getConfig();
    const fetchApiService = new FetchApiService(config.api.theCatsApi.baseUrl, {apiKey: config.auth?.theCatsApi?.apiKey});
    const catsImages = new CatImagesApi(fetchApiService);

    let uploadedImageJson: ImageDto;

    describe('Upload image tests', () => {
        test('Upload cat image', async () => {
            const [response, json] = await catsImages.uploadImage('./artifacts/cat-3.jpg');

            expect(response.ok).toBe(true);
            expect(json).toBeDefined();
            expect(json.id).toBeDefined();
            expect(json.url).toBeDefined();
            uploadedImageJson = json;
            console.log(uploadedImageJson);
        });

        test('Check that image was uploaded', async () => {
            const [response, json] = await catsImages.getMyImages();

            expect(response.ok).toBe(true);
            expect(json).toBeDefined();
            expect(json.length).toBeGreaterThan(0);
            const uploadedImage = json.find(img => img.id === uploadedImageJson.id);
            expect(uploadedImage).toBeDefined();
            expect(uploadedImage?.url).toBe(uploadedImageJson.url);
            expect(uploadedImage?.original_filename).toBe(uploadedImageJson.original_filename);
        });
    });
});
