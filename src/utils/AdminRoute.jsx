    import React, { useContext } from 'react';
    import { Navigate, Outlet } from 'react-router-dom';
    import AuthContext from '../context/AuthContext';

    function AdminRoute() {
      const { user } = useContext(AuthContext);

      // Jika ada user DAN user adalah staf, izinkan akses. Jika tidak, arahkan ke halaman utama.
      return user && user.is_staff ? <Outlet /> : <Navigate to="/" />;
    }

    export default AdminRoute;