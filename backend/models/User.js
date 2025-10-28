// models/User.js - ĐÃ CẬP NHẬT CHO HOẠT ĐỘNG 2
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },

  // --- BẮT ĐẦU PHẦN THÊM VÀO CHO HĐ 2 ---
  name: {
    type: String,
    default: 'Người dùng mới' // Đặt một giá trị mặc định
  },
  avatar: {
    type: String,
    default: '' // Link ảnh mặc định (nếu có)
  },
  // --- KẾT THÚC PHẦN THÊM VÀO ---

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
export default User; // Sửa 'module.exports' thành 'export default'