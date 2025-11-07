// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(() => {
    const tokens = localStorage.getItem('authTokens');
    if (tokens) {
      try {
        const parsed = JSON.parse(tokens);
        const decoded = jwtDecode(parsed.access);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('authTokens');
          return null;
        }
        return decoded;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // Function to update auth tokens
  const updateToken = useCallback(async () => {
    const tokens = localStorage.getItem('authTokens');
    if (!tokens) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(tokens);
      const decoded = jwtDecode(parsed.access);
      
      // Check if token is expired (with 5 minute buffer)
      const tokenExpiration = decoded.exp * 1000;
      const fiveMinutes = 5 * 60 * 1000;
      
      if (tokenExpiration < Date.now() + fiveMinutes) {
        // Token is expired or about to expire, try to refresh
        try {
          const response = await apiClient.post('/token/refresh/', {
            refresh: parsed.refresh
          });
          
          const newTokens = response.data;
          setAuthTokens(newTokens);
          setUser(jwtDecode(newTokens.access));
          localStorage.setItem('authTokens', JSON.stringify(newTokens));
        } catch (refreshError) {
          // Refresh failed, logout user
          console.error('Token refresh failed:', refreshError);
          setAuthTokens(null);
          setUser(null);
          localStorage.removeItem('authTokens');
          navigate('/login');
        }
      } else {
        // Token is still valid, just update user state
        setUser(decoded);
      }
    } catch (error) {
      console.error('Error updating token:', error);
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem('authTokens');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Check token expiration on mount and set interval
  useEffect(() => {
    if (authTokens) {
      updateToken();
      // Set interval to check token every 4 minutes (before 5 minute buffer)
      const interval = setInterval(() => {
        updateToken();
      }, 4 * 60 * 1000); // 4 minutes

      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [authTokens, updateToken]);

  const loginUser = async (username, password) => {
    try {
      const response = await apiClient.post('/token/', { username, password });
      const data = response.data;
      
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
      navigate('/');
      
    } catch (error) {
      console.error('Login Gagal:', error);
      if (error.response && error.response.status === 401) {
        alert('Login Gagal! Username atau password salah.');
      } else {
        alert('Login Gagal! Terjadi kesalahan pada server.');
      }
    }
  };

  const registerUser = async (username, email, password, password2) => {
    try {
      await apiClient.post('/register/', { username, email, password, password2 });
      await loginUser(username, password);
    } catch (error) {
      console.error('Registrasi Gagal:', error.response?.data || error.message);
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        let errorMessage = 'Registrasi Gagal!\n';
        if (errorData.username) errorMessage += `Username: ${errorData.username[0]}\n`;
        if (errorData.email) errorMessage += `Email: ${errorData.email[0]}\n`;
        if (errorData.password) errorMessage += `Password: ${errorData.password[0]}\n`;
        alert(errorMessage);
      } else {
        alert('Registrasi Gagal! Terjadi kesalahan pada server.');
      }
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  };
  
  // Pastikan semua fungsi ada di sini
  const contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    registerUser: registerUser,
    logoutUser: logoutUser,
    updateToken: updateToken,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-400">Memuat...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};