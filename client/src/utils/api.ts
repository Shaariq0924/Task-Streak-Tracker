import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('API Base URL:', api.defaults.baseURL); // Debugging
console.log('Environment:', import.meta.env.MODE); // Debugging

export default api;
