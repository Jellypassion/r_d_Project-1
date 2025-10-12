import { fetchUser } from './services/api.service';
import { UserShort } from './models/user-short.class';

async function main() {
    try {
        const user1 = await fetchUser(1);
        const shortUser1 = new UserShort(user1);
        console.log(`Full User: ${user1}`);
        console.log(`Short User: ${shortUser1}`);
    } catch (error) {
        console.error('Error:', error);
    }
}
