// frontend/src/services/api.js
import axios from 'axios';

// Create a configured Axios instance
const api = axios.create({
    // Our Express server is running on port 5000
    baseURL: 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;