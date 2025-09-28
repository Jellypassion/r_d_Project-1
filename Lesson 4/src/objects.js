const user1 = {
    name: 'Alice',
    age: 25,
    userInfo: function () {
        console.log(`Name: ${this.name}\nAge: ${this.age}`);
    }
};
user1.userInfo();

const animals = ['Cat', 'Dog'];
const namedAnimals = {
    [animals[0]]: 'Barsik',
    [animals[1]]: 'Rex'
};
user1.pets = namedAnimals;
user1.showPets = function () {
    console.log(Object.keys(user1.pets));
};
user1.showPets();
const animalFood = ['cat food', 'dog food'];
user1.hasFood = animalFood;
user1.needsToBuyFood = [];

console.log(user1);
