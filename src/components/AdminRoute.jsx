// frontend/src/components/AdminRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function AdminRoute() {
  const { user } = useContext(AuthContext);

  // Jika user ada DAN user adalah staf, izinkan masuk (tampilkan <Outlet />)
  // Jika tidak, tendang mereka kembali ke Halaman Utama
  return user && user.is_staff ? <Outlet /> : <Navigate to="/" />;
}

export default AdminRoute;