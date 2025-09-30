let sumAllItems = (array) => {
    if (!Array.isArray(array)) {
        console.log('The argument is not array');
        return;
    }
    if (array.length === 0) {
        console.log('Array is empty');
        return;
    }
    let initialValue = typeof array[0] === 'string' ? '' : 0;
    const sum = array.reduce((acc, n) => acc + n, initialValue);
    console.log(`The initial array is: ${array}`);
    if (typeof sum === 'number') {
        console.log(`The sum of numbers is: ${sum}`);
    } else if (typeof sum === 'string') {
        console.log(`The resulting concatenation is: ${sum}`);
    } else console.log('Unknown result');
};

const numberArr = [1, 2, 3];
const stringArr = ['Hello', 'world'];
sumAllItems(numberArr);
sumAllItems(stringArr);
