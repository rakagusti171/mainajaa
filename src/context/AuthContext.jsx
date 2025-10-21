// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(() => 
    localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access) : null
  );
  
  const navigate = useNavigate();

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
    loginUser: loginUser,
    registerUser: registerUser,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};