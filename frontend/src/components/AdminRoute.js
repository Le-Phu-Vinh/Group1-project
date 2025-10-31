
// src/components/AdminRoute.js

import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'Admin') {
    // Optional: Redirect to a 'not authorized' page or home
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};

export default AdminRoute;
