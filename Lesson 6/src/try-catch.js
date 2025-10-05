const allUsers = 'https://jsonplaceholder.typicode.com/users';
const existingUser = 'https://jsonplaceholder.typicode.com/users/1';
const nonExistentUser = 'https://jsonplaceholder.typicode.com/users/11';
const nonExistentDomain = 'https://this-domain-does-not-exist.xyz/users/1';
const fakeAllUsers = 'https://fake-domain-1234.com/users';

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        const error = new Error(`HTTP error: ${response.status} ${response.text}`);
        error.status = response.status;
        error.response = response;
        throw error;
    }
    return response.json();
}

async function getUserData(url) {
    console.log('Sending API request to primary resource...');
    try {
        user = await fetchJson(url);
        console.log('Primary resource returned user: ', user);
    } catch (err) {
        console.warn('Primary request failed: ', err.message);

        if (err.status === 404) {
            console.log('User not found. Fetching all users instead...');
        } else {
            console.log('Primary request failed due to some error. Trying to fetch all users...');
        }

        try {
            const all = await fetchJson(allUsers);
            console.log('Fallback resource returned list of all users. Count: ', all.length);
            return all;
        } catch (err2) {
            console.error('Fallback also failed: ', err2.message);
            throw new Error('Both primary and fallback requests failed. Cannot get user data.');
        }
    }
}

getUserData(nonExistentUser)
    .then((data) => {
        console.log('Final result: ', data);
    })
    .catch((finalErr) => {
        console.log('Final error: ', finalErr);
    });
