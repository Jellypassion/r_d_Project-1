export interface IPet {
    name: string;
    age: number;
    isHungry: boolean;

    makeSound(): void;
    feed(): void;
}
