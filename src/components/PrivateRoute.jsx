    import React, { useContext } from 'react';
    import { Navigate, Outlet } from 'react-router-dom';
    import AuthContext from '../context/AuthContext';

    function PrivateRoute() {
      const { user } = useContext(AuthContext);

      // Jika ada user, izinkan akses. Jika tidak, arahkan ke halaman login.
      return user ? <Outlet /> : <Navigate to="/login" />;
    }

    export default PrivateRoute;