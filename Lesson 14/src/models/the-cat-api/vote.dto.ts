import { ImageDto } from './image.dto';

export interface CatVoteDto {
    id: number;
    image_id: string;
    sub_id?: string | null;
    created_at: string; // ISO 8601 timestamp
    value: number;
    country_code?: string | null;
    image?: ImageDto;
}

export interface CreateVoteRequest {
    image_id: string;
    sub_id?: string;
    value: number; // 1 for upvote, -1 for downvote
}

export interface CreateVoteResponse {
    message: string;
    id: number;
    image_id: string;
    sub_id?: string;
    value: number;
    country_code?: string;
}
