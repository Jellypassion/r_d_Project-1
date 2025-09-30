const user1 = {
    _name: 'Alice',
    _age: 25,
    get name() {
        return this._name;
    },

    get userInfo() {
        return this._name + ', ' + this._age;
    },

    set pets(namedAnimals) {
        if (typeof namedAnimals !== 'object') {
            console.log('Invalid argument type. Required type: object');
            return;
        }
        this._pets = namedAnimals;
    },

    get pets() {
        return this._pets;
    },

    checkFoodToBuy: function () {
        let foodToBuy = [];
        if (!this.pets || typeof this.pets !== 'object') {
            return foodToBuy;
        }
        if (Object.keys(this.pets).includes('cat')) {
            foodToBuy.push('cat food');
        }
        if (Object.keys(this.pets).includes('dog')) {
            foodToBuy.push('dog food');
        }
        return foodToBuy;
    }
};

const animals = {
    cat: 'Barsik',
    dog: 'Rex'
};
user1.pets = animals;
console.log(user1.userInfo);
console.log(user1.pets);
console.log(`${user1.name} needs to buy: ${user1.checkFoodToBuy()}`);
