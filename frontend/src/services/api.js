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

// NEW: Add a response interceptor to catch global network errors
api.interceptors.response.use(
    (response) => {
        // Any status code within the 2xx range triggers this.
        // Just return the response normally.
        return response;
    },
    (error) => {
        // Any status code outside the 2xx range triggers this.
        
        // 1. Check if it's a hard network error (server offline, no Wi-Fi, etc.)
        if (!error.response || error.code === 'ERR_NETWORK') {
            console.error("Backend unreachable! Redirecting to /error");
            window.location.href = '/error'; // Triggers your new NetworkError page
        }

        // 2. Otherwise, reject the promise so your individual pages (like Auth.jsx) 
        // can still show toast errors for things like "Wrong Password" (401)
        return Promise.reject(error);
    }
);

export default api;