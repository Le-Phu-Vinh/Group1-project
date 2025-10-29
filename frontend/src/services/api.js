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

export default api;