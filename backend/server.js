// backend/server.js

// 1. Load Biến Môi Trường (RẤT QUAN TRỌNG)
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// 2. Import Routes
const userRoutes = require('./routes/user'); 


const app = express();
app.use(express.json());

// 3. Middleware CẦN THIẾT (QUAN TRỌNG NHẤT: express.json)
app.use(cors()); 
 // <--- DÒNG NÀY PHẢI CÓ ĐỂ ĐỌC JSON BODY TỪ POSTMAN

// 4. Định nghĩa Route
app.use('/users', userRoutes);

// 5. Kết nối Database
const DB = process.env.MONGO_URI; 

mongoose.connect(DB)
    .then(() => console.log('✅ Database Connected Successfully!'))
    .catch(err => console.error('❌ Database Connection Error:', err));

// 6. Khởi động Server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Xử lý Unhandled Rejections (Để bắt lỗi server)
process.on('unhandledRejection', err => {
    console.log('❌ UNHANDLED REJECTION! Shutting down...');
    console.error('Error:', err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
