let sumAllItems2 = (array: number[] | string[]): void => {
    if (!Array.isArray(array)) {
        console.log('The argument is not array');
        return;
    }

    if (array.length === 0) {
        console.log('Array is empty');
        return;
    }

    console.log(`The initial array is: ${array}`);
    if (typeof array[0] === 'number') {
        const sum = (array as number[]).reduce((a, b) => a + b, 0);
        console.log(`The sum of numbers is: ${sum}`);
    } else {
        const sum = (array as string[]).reduce((a, b) => a + b, '');
        console.log(`The resulting concatenation is: ${sum}`);
    }
};

const numberArr2 = [1, 2, 3];
const stringArr2 = ['Hello', 'world'];
sumAllItems2(numberArr2);
sumAllItems2(stringArr2);
