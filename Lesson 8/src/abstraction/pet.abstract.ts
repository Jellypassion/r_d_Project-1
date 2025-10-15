export abstract class Pet {
    public name: string;
    public age: number;
    public isHungry = false;

    public constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    public abstract getInfo(): string;

    public abstract makeSound(): void;

    public checkIfItHungry(): void {
        const hungryCondition = this.isHungry ? ' is hungry' : ' is not hungry';
        console.log(`${this.name}${hungryCondition}`);
    }

    public feed(): void {
        if (!this.isHungry) {
            console.log(`${this.name} is not hungry!`);
            return;
        }

        console.log(`Feeding ${this.name}...`);
        console.log(`${this.name} is now full.`);
        this.isHungry = false;
    }

    public spendSomeTime(): void {
        this.isHungry = true;
    }
}
