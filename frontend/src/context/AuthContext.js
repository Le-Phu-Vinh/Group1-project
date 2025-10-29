// src/context/AuthContext.js

import { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // Import file api.js

// 1. Tạo Context
export const AuthContext = createContext();

// 2. Tạo "Nhà cung cấp" (Provider)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // State để chờ check login

  // 3. Kiểm tra đăng nhập khi tải lại trang
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Nếu có token, gọi API /profile (Hoạt động 2) để lấy thông tin user
      api.get('/profile')
        .then(res => {
          setUser(res.data); // Lưu thông tin user vào state
        })
        .catch(() => {
          // Nếu token hỏng/hết hạn, xóa nó đi
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false); // Hoàn tất kiểm tra
        });
    } else {
      setLoading(false); // Không có token, không cần check
    }
  }, []); // Chỉ chạy 1 lần khi app khởi động

  // 4. Hàm Login (Hoạt động 1)
  const login = (userData, token) => {
    localStorage.setItem('token', token); // Lưu token vào localStorage
    setUser(userData); // Cập nhật user trong state
  };

  // 5. Hàm Logout (Hoạt động 1)
  const logout = () => {
    localStorage.removeItem('token'); // Xóa token
    setUser(null); // Clear user trong state
  };

  // 6. Hàm cập nhật user (dùng cho Hoạt động 2)
  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  // Chờ cho đến khi kiểm tra xong token
  if (loading) {
    return <div>Đang tải, vui lòng chờ...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};