import { UserDTO } from 'src/models/user.interface';

export class UserShort {
    id: number;
    name: string;
    city: string;
    companyName: string;

    constructor(user: UserDTO) {
        this.id = user.id;
        this.name = user.name;
        this.city = user.address.city;
        this.companyName = user.company.name;
    }
}
