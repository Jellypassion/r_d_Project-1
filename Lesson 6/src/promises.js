function processUser(user) {
    return {
        id: user.id,
        fullName: user.name,
        email: user.email,
        city: user.address.city,
        company: user.company.name
    };
}

function getUser() {
    return fetch('https://jsonplaceholder.typicode.com/users/1')
        .then((response) => {
            console.log('Response success:', response.ok, '\nstatus code:', response.status);
            return response.json();
        })
        .then((json) => {
            console.log('User data received:', json);
            return processUser(json);
        })
        .catch((e) => console.error('Error:', e));
}

getUser().then((user) => {
    console.log('User created:', user);
});
