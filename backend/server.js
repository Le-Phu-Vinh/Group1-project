//mongo
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://si224697_db_user:123456789Aa@cluster0.yvo1aet.mongodb.net/?appName=Cluster0';
// server.js

const express = require('express');
const app = express();
const bcrypt = require('bcrypt'); // <-- MỚI: Cần cho Admin Seeder

const cors = require('cors');
app.use(cors());

// 1. Nhập (import) tệp routes
const userRoutes = require('./routes/user'); 
const User = require('./models/User'); // <-- MỚI: Cần cho Admin Seeder

// Middleware: Cho phép ứng dụng đọc JSON từ request body
app.use(express.json());

// 2. Định nghĩa cổng, ưu tiên biến môi trường
const PORT = process.env.PORT || 3000;

// API chào mừng (Tùy chọn)
app.get('/', (req, res) => {
    res.send('API is running. Access /users for user endpoints.');
});

// 3. Kết nối MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
        console.log('✅ Connected to MongoDB successfully!');
        
        // --- ADMIN SEEDING SCRIPT ---
        const seedAdminUser = async () => {
            try {
                const adminEmail = 'admin@example.com';
                const adminPassword = 'adminpassword';
                
                const adminExists = await User.findOne({ email: adminEmail });

                if (!adminExists) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(adminPassword, salt);

                    await User.create({
                        name: 'System Admin',
                        email: adminEmail,
                        password: hashedPassword,
                        role: 'admin', 
                    });

                    console.log(`✅ Admin User created! Email: ${adminEmail}, Password: ${adminPassword}`);
                    console.log("   *** PLEASE DO NOT USE THIS PASSWORD IN PRODUCTION ***");
                } else {
                    if (adminExists.role !== 'admin') {
                        adminExists.role = 'admin';
                        await adminExists.save();
                        console.log(`✅ Existing user ${adminEmail} updated to 'admin' role.`);
                    } else {
                        console.log('Admin User already exists. Skipping creation.');
                    }
                }
            } catch (error) {
                console.error('❌ ERROR seeding Admin User:', error.message);
            }
        };
        seedAdminUser(); 
        // --- KẾT THÚC ADMIN SEEDING SCRIPT ---

    })
  .catch(err => console.error('❌ MongoDB connection error:', err));


// 4. Kết nối routes (Đặt sau khi kết nối DB, trước khi listen)
app.use('/users', userRoutes); 

// Khởi động server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
