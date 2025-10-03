function processUser(user) {
    return {
        id: user.id,
        fullName: user.name,
        email: user.email,
        city: user.address.city,
        company: user.company.name
    };
}

async function getUser() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
    console.log('Response success:', response.ok, '\nstatus code:', response.status);

    const json = await response.json();
    console.log('User data received:', json);

    return processUser(json);
}

(async () => {
    try {
        const user = await getUser();
        console.log('User created:', user);
    } catch (e) {
        console.log(e);
    }
})();
