let number1 = 2;
let str1 = '3';
let var1;

let plusResult = number1 + str1 + var1;
//console.log(plusResult);
switch (typeof plusResult) {
    case 'number':
        console.log(`An addition operation was performed \nThe result is ${plusResult}`);
        break;
    case 'string':
        console.log(`Concatenation operation performed \nThe result is ${plusResult}`);
        break;
    default:
        console.log('Undefined operation');
        break;
}
