// frontend/src/api/axiosConfig.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Kita perlu library ini
import dayjs from 'dayjs';

// Pastikan Anda sudah menginstall library ini:
// npm install jwt-decode dayjs

const baseURL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTOR (PENCEGAT) DIMULAI DI SINI ---
apiClient.interceptors.request.use(async (config) => {
  let authTokens = JSON.parse(localStorage.getItem('authTokens'));

  if (!authTokens) {
    return config; // Jika tidak ada token, lanjutkan (misal: ke halaman login)
  }

  const user = jwtDecode(authTokens.access);
  const isExpired = dayjs.unix(user.exp).isBefore(dayjs());

  if (!isExpired) {
    // Token masih segar, tambahkan ke header dan lanjutkan
    config.headers.Authorization = `Bearer ${authTokens.access}`;
    return config;
  }

  // --- Token kedaluwarsa, minta yang baru! ---
  console.log('Access token expired, refreshing...');
  try {
    const response = await axios.post(`${baseURL}token/refresh/`, {
      refresh: authTokens.refresh,
    });

    // Simpan token baru
    localStorage.setItem('authTokens', JSON.stringify(response.data));
    
    // Perbarui header permintaan yang sedang dicegat
    config.headers.Authorization = `Bearer ${response.data.access}`;
    return config;
    
  } catch (refreshError) {
    // Jika refresh token juga gagal/kedaluwarsa
    console.error('Refresh token failed:', refreshError);
    // Hapus token lama dan redirect ke login
    localStorage.removeItem('authTokens');
    window.location.href = '/login'; // Paksa redirect
    return Promise.reject(refreshError);
  }
});


export default apiClient;
