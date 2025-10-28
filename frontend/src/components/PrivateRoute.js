import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Nếu chưa đăng nhập, chuyển về trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, cho phép truy cập
  return <Outlet />;
};

export default PrivateRoute;