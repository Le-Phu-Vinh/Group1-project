const jwt = require('jsonwebtoken');

// Đặt Secret Key ở đây hoặc dùng biến môi trường (Ưu tiên)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-123456'; 
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// ĐÃ SỬA: Hàm nhận cả ID và ROLE
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN, // Hạn sử dụng 30 ngày
  });
};

module.exports = generateToken;