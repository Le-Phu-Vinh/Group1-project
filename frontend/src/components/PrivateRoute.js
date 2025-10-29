 frontend
// src/components/PrivateRoute.js


 main
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
 frontend
  const { isAuthenticated } = useContext(AuthContext); // Lấy trạng thái đăng nhập

  if (!isAuthenticated) {

  const { user } = useContext(AuthContext);

  if (!user) {
 main
    // Nếu chưa đăng nhập, chuyển về trang login
    return <Navigate to="/login" replace />;
  }

 frontend
  // Nếu đã đăng nhập, cho phép hiển thị component con (ví dụ: Profile)

  // Nếu đã đăng nhập, cho phép truy cập
 main
  return <Outlet />;
};

export default PrivateRoute;