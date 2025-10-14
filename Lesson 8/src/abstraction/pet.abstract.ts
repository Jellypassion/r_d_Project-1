import { IPet } from './i-pet.interface';

export abstract class Pet implements IPet {
    name: string;
    age: number;
    public isHungry: boolean = false;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    abstract getInfo(): string;

    abstract makeSound(): void;

    checkIfItHungry() {
        const hungryCondition = this.isHungry ? ' is hungry' : ' is not hungry';
        console.log(`${this.name}${hungryCondition}`);
    }

    feed(): void {
        if (!this.isHungry) {
            console.log(`${this.name} is not hungry!`);
            return;
        }

        console.log(`Feeding ${this.name}...`);
        console.log(`${this.name} is now full.`);
        this.isHungry = false;
    }

    spendSomeTime(): void {
        this.isHungry = true;
    }
}
