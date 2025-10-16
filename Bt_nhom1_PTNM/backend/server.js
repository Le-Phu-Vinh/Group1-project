const express = require('express'); 
const app = express(); 
const userRoutes = require('./routes/user');
app.use(express.json()); 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Middleware để đọc JSON từ request body (rất quan trọng cho POST)
app.use(express.json());

// Định nghĩa base path cho routes người dùng: /api/users
app.use('/api/users', userRoutes);

// Route mặc định (tùy chọn)
app.get('/', (req, res) => {
    res.send('Server đang chạy. Truy cập /api/users để xem API người dùng.');
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sử dụng routes (cập nhật để dùng DB thay vì mảng tạm)
app.use('/users', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));