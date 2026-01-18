// frontend/src/services/api.js
import axios from 'axios';

// Create a configured Axios instance
const api = axios.create({
    // This points to your Node.js/Express Backend
    baseURL: 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add an interceptor to attach tokens if you implement Auth later
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export default api;