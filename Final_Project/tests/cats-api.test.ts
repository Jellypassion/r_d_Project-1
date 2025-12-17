// This test file is for the old Cat API implementation
// It has been disabled after migrating to Fophelp API
// You can delete this file or uncomment to use with the old API structure

//*
import { describe, expect, test } from 'vitest';
import { ConfigService } from '../src/services/config.service';
import { FetchApiService } from '../src/services/fetch-api-service';
import { CatImagesApi } from '../src/apis/the-cat-api/images.api';
import { ImageDto } from '../src/models/the-cat-api/image.dto';
import { FavouritesApi } from '../src/apis/the-cat-api/favourites.api';
import { VotesApi } from '../src/apis/the-cat-api/votes.api';

describe('Cats API integration tests', () => {
    const config = (new ConfigService()).getConfig();
    const fetchApiService = new FetchApiService(config.api.theCatsApi.baseUrl, {apiKey: config.auth?.theCatsApi?.apiKey});
    const catsImages = new CatImagesApi(fetchApiService);
    const favouritesApi = new FavouritesApi(fetchApiService);
    const votesApi = new VotesApi(fetchApiService);

    let uploadedImageJson: ImageDto;
    let favouriteId: number;
    let voteId: number;

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

    describe('Favourites tests', () => {
        test('Add image to favourites', async () => {
            const [response, json] = await favouritesApi.addFavourite(uploadedImageJson.id, 'user-123');

            expect(response.ok).toBe(true);
            expect(json).toBeDefined();
            expect(json.message).toBe('SUCCESS');
            expect(json.id).toBeDefined();
            if (response.ok) {
                console.log('created favourite id', json.id);
                favouriteId = json.id;
            }
        });

        test('Get favourites and check added image is present', async () => {
            const [response, json] = await favouritesApi.getFavourites();

            expect(response.ok).toBe(true);
            expect(json).toBeDefined();
            expect(json.length).toBeGreaterThan(0);
            const favourite = json.find(fav => fav.id === favouriteId);
            expect(favourite).toBeDefined();
            expect(favourite?.image_id).toBe(uploadedImageJson.id);
            expect(favourite?.image.id).toBe(uploadedImageJson.id);
            expect(favourite?.image.url).toBe(uploadedImageJson.url);
        });
    });

    describe('Votes tests', () => {
        test('Create an upvote for the image', async () => {
            const [response, json] = await votesApi.createVote(uploadedImageJson.id, 1, 'user-123');

            expect(response.ok).toBe(true);
            expect(json).toBeDefined();
            expect(json.message).toBe('SUCCESS');
            expect(json.id).toBeDefined();
            expect(json.value).toBe(1);
            expect(json.image_id).toBe(uploadedImageJson.id);
            expect(json.sub_id).toBe('user-123');
            expect(json.country_code).toBeDefined();
            if (response.ok) {
                console.log('created vote id', json.id);
                voteId = json.id;
            }
        });

        test('Get votes and validate the vote data', async () => {
            const [response, json] = await votesApi.getVotes();

            expect(response.ok).toBe(true);
            expect(json).toBeDefined();
            expect(json.length).toBeGreaterThan(0);
            const vote = json.find(v => v.id === voteId);
            expect(vote).toBeDefined();
            expect(vote?.image_id).toBe(uploadedImageJson.id);
            expect(vote?.value).toBe(1);
            expect(vote?.sub_id).toBe('user-123');
            expect(vote?.country_code).toBeDefined();
            expect(vote?.created_at).toBeDefined();
            expect(vote?.image?.id).toBe(uploadedImageJson.id);
            expect(vote?.image?.url).toBe(uploadedImageJson.url);
        });
    });
});
*/
