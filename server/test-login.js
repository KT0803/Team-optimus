const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing login...');
        const response = await axios.post('http://localhost:8000/api/auth/login', {
            email: '8055sandesh8055@gmail.com',
            password: '123123123'
        });
        console.log('Login successful:', response.data);
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
    }
}

testLogin();
