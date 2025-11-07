import axios from 'axios';

// 1. Kita definisikan variabel 'API_URL' di sini
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  // 2. Kita gunakan variabel 'API_URL' itu di sini
  baseURL: API_URL 
});

// Request interceptor - Add token to headers
apiClient.interceptors.request.use(
  (req) => {
    const authTokens = localStorage.getItem('authTokens');
    if (authTokens) {
      try {
        const parsed = JSON.parse(authTokens);
        if (parsed.access) {
          req.headers.Authorization = `Bearer ${parsed.access}`;
        }
      } catch (e) {
        console.error('Error parsing auth tokens:', e);
      }
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh on 401 errors
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalRequest = err.config;

    // If error is 401 and we haven't tried to refresh yet
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const authTokens = localStorage.getItem('authTokens');
      if (!authTokens) {
        processQueue(err, null);
        isRefreshing = false;
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(err);
      }

      try {
        const parsed = JSON.parse(authTokens);
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: parsed.refresh
        });

        const { access } = response.data;
        const newTokens = { ...parsed, access };
        localStorage.setItem('authTokens', JSON.stringify(newTokens));

        processQueue(null, access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        localStorage.removeItem('authTokens');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default apiClient;