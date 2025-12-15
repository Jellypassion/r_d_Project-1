import { ImageDto } from './image.dto';

export interface FavouriteDto {
    id: number;
    user_id: string;
    image_id: string;
    sub_id: string;
    created_at: string;
    image: ImageDto;
}

export interface AddFavouriteRequest {
    image_id: string;
    sub_id?: string;
}

export interface AddFavouriteResponse {
    message: string;
    id: number;
}
