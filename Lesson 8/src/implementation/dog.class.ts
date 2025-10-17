import { Pet } from '../abstraction/pet.abstract';

export class Dog extends Pet {
    public constructor(name: string, age: number) {
        super(name, age);
    }

    public getInfo(): string {
        return 'Dog name: ' + this.name + '\n' + 'Dog age: ' + this.age;
    }

    public makeSound(): void {
        const times = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < times; i++) {
            console.log(`${this.name}: woof!`);
        }
    }
}
