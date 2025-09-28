// Масив strings
const animals = ['Cat', 'Dog', 'Horse'];
animals.push('Cow');
console.log(animals);
const cow1 = animals.pop();
console.log(`Removed animal: ${cow1}, remained animals: ${animals}`);
animals.unshift('Fish');
console.log(animals);
const fish1 = animals.shift();
console.log(`Removed animal: ${fish1}, remained animals: ${animals}`);
animals.forEach((animal, index) => {
    console.log(`Animal #${index + 1} : ${animal}`);
});
console.log('---------------');
// Масив чисел
const numbers = [1, 2, 3, 4, 5];
numbers.pop();
console.log(numbers);
numbers.unshift(-1, 0, 6, 5);
console.log(numbers);
numbers.sort((a, b) => a - b);
console.log(numbers);
console.log(`Sum of numbers = ${numbers.reduce((acc, n) => acc + n, 0)}`);
const newNumbers = numbers.map((number) => number / 2);
console.log(newNumbers);

console.log('---------------');
// Масив boolean
const booleans = [true, false, true, false];
booleans.splice(2, 2);
console.log(booleans);
console.log(booleans.indexOf(true));

console.log('---------------');

//Масив "any"
const anyArray = ['hello', 'world', 22, true, { name: 'Alice' }, [1, 2, 3]];
const foundStrings = anyArray.filter((value) => typeof value == 'string');
console.log(foundStrings);
const newAnyArr = [...anyArray, ...animals];
console.log(newAnyArr);
