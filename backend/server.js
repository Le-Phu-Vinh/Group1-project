//mongo
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://si224697_db_user:123456789Aa@cluster0.yvo1aet.mongodb.net/?appName=Cluster0';
// server.js

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

// 1. Nhập (import) tệp routes
const userRoutes = require('./routes/user'); // Đảm bảo đường dẫn này đúng

// Middleware: Cho phép ứng dụng đọc JSON từ request body (cho POST /users)
app.use(express.json());

// 2. Định nghĩa cổng, ưu tiên biến môi trường
const PORT = process.env.PORT || 3000;

// API chào mừng (Tùy chọn)
app.get('/', (req, res) => {
    res.send('API is running. Access /users for user endpoints.');
});

// 3. Kết nối routes
// Tất cả các request bắt đầu bằng '/users' sẽ được chuyển đến userRoutes
app.use('/users', userRoutes); 

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Khởi động server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));