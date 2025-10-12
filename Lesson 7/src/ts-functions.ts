function sumAllItems(array: number[] | string[]): void {
    if (array.length === 0) {
        console.log('Array is empty');
        return;
    }

    if (array.every((item) => typeof item === 'number')) {
        const sum = array.reduce((acc, n) => acc + n, 0);
        console.log(`The initial array is: ${array}`);
        console.log(`The sum of numbers is: ${sum}`);
    } else if (array.every((item) => typeof item === 'string')) {
        const sum = array.reduce((acc, n) => acc + n, '');
        console.log(`The initial array is: ${array}`);
        console.log(`The resulting concatenation is: ${sum}`);
    } else {
        console.log('Array contains mixed types');
    }
}

const numberArr = [1, 2, 3];
const stringArr = ['Hello', 'world'];
sumAllItems(numberArr);
sumAllItems(stringArr);
