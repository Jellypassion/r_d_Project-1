import { fetchUser } from './services/api.service';
import { UserShort } from './models/user-short.class';
import { Cat } from './implementation/cat.class';
import { Dog } from './implementation/dog.class';

async function main(): Promise<void> {
    try {
        const user1 = await fetchUser(1);
        const shortUser1 = new UserShort(user1);
        console.log('Full User: ', user1);
        console.log('Short User: ', shortUser1);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();

console.log('----------------------------');
const cat1 = new Cat('Barsik', 5);
console.log(cat1.getInfo());
cat1.makeSound();
cat1.checkIfItHungry();
cat1.feed();

console.log('----------------------------');
const dog1 = new Dog('Rex', 4);
console.log(dog1.getInfo());
dog1.makeSound();
dog1.spendSomeTime();
dog1.checkIfItHungry();
dog1.feed();
dog1.checkIfItHungry();
console.log('----------------------------');
