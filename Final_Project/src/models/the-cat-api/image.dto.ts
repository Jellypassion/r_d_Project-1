
export interface ImageDto {
    id: string;
    url: string;
    width: number;
    height: number;
    original_filename: string;
    pending: number;
    approved: number;
    breeds: unknown[];
    sub_id: string | null;
    created_at: string;
    breed_ids: string | null;
}
