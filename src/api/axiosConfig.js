import axios from 'axios';

// 1. Kita definisikan variabel 'API_URL' di sini
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  // 2. Kita gunakan variabel 'API_URL' itu di sini
  baseURL: API_URL 
});

// Anda mungkin memiliki logika untuk interceptor token di sini, biarkan saja
apiClient.interceptors.request.use(req => {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    if (authTokens) {
        req.headers.Authorization = `Bearer ${authTokens.access}`;
    }
    return req;
});

export default apiClient;