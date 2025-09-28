// Task1
for (let i = 0; i < 10; i++) {
    console.log(i);
}
console.log('---------------');

let i = 0;
while (i < 10) {
    console.log(i);
    i++;
}
console.log('---------------');

i = 0;
do {
    console.log(i);
    i++;
} while (i < 10);
console.log('---------------');

// Task 2
for (let i = 100; i >= 0; i -= 10) {
    console.log(i);
}
console.log('---------------');

i = 100;
while (i >= 0) {
    console.log(i);
    i -= 10;
}
console.log('---------------');

i = 100;
do {
    console.log(i);
    i -= 10;
} while (i >= 0);
