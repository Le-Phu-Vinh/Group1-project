// src/components/PrivateRoute.js

import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated } = useContext(AuthContext); // Lấy trạng thái đăng nhập

  if (!isAuthenticated) {
    // Nếu chưa đăng nhập, chuyển về trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, cho phép hiển thị component con (ví dụ: Profile)
  return <Outlet />;
};

export default PrivateRoute;