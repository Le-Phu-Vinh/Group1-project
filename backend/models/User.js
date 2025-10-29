// models/User.js
const mongoose = require('mongoose');

// Định nghĩa cấu trúc dữ liệu cho Collection 'users'
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Đảm bảo email không trùng lặp
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Chỉ cho phép hai giá trị 'user' hoặc 'admin'
        default: 'user'
    }
    // MongoDB sẽ tự động thêm trường _id
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

// Xuất ra model để sử dụng trong controller
module.exports = mongoose.model('User', UserSchema);