import { Pet } from '../abstraction/pet.abstract';

export class Cat extends Pet {
    constructor(name: string, age: number) {
        super(name, age);
    }

    getInfo(): string {
        return 'Cat name: ' + this.name + '\n' + 'Cat age: ' + this.age;
    }

    makeSound(): void {
        const times = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < times; i++) {
            console.log(`${this.name}: meow!`);
        }
    }
}
