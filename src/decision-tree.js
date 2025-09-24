let number1 = -2;
let number2 = 5;
let str1 = 'hello';
let str2 = 'world';
let bool1 = number1 < number2;

if (bool1) {
    console.log(`${str1} ${str2}!`);
}

if (!bool1 === 0) {
    console.log('Hello');
} else {
    console.log(!bool1 == 0);
}

if (number1 < 0 && number2 < 0) {
    console.log('Both numbers are negative');
} else if (number1 == 0 && number2 == 0) {
    console.log('Both numbers are 0');
} else if (number1 > 0 && number2 > 0) {
    console.log('Both numbers are positive');
} else {
    if (number1 == 0 && number2 == 0) {
        console.log('Both numbers are 0');
    } else {
        console.log('One of the numbers is positive, another is negative');
    }
}
