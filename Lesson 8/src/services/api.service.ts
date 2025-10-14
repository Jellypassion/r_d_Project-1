import { API_BASE_URL, USER_ENDPOINT } from '../models/config';
import { UserDTO } from '../models/user.interface';

export async function fetchUser(id: number): Promise<UserDTO> {
    const url = `${API_BASE_URL}${USER_ENDPOINT}/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error. Status ${response.status}`);
    }

    const data = await response.json();
    return data;
}
