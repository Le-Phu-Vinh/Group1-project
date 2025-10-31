// src/services/api.js

import axios from 'axios';

// Đặt base URL là địa chỉ backend của bạn
const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

/* Interceptor: Đây là một đoạn code "nghe lén"
  trước khi request được gửi đi.
*/
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (sẽ được lưu khi login)
    const token = localStorage.getItem('token');
    
    if (token) {
      // Nếu có token, gắn nó vào header Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Lấy danh sách tất cả người dùng (yêu cầu quyền admin)
export const getUsers = () => api.get('/users');

// Xóa một người dùng theo ID (yêu cầu quyền admin)
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Gửi yêu cầu quên mật khẩu
export const forgotPassword = (email) => api.post('/users/forgot-password', { email });

// Đặt lại mật khẩu bằng token
export const resetPassword = (token, password, passwordConfirm) => 
  api.patch(`/users/reset-password/${token}`, { password, passwordConfirm });


export default api;