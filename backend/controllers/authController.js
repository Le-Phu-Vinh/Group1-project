// controllers/authController.js - Hàm signup

const jwt = require('jsonwebtoken');

const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // 1. Kiểm tra email trùng
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại.' });
        }

        // 2. Mã hóa mật khẩu (bcrypt)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Tạo và lưu User mới
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            role: 'user' // Mặc định là user
        });
        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Tìm User theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // 2. Xác thực mật khẩu (bcrypt.compare)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // 3. Tạo JWT token
        const payload = { 
            userId: user._id, 
            role: user.role 
        };
        // Lấy khóa bí mật từ biến môi trường
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'your_default_secret_key', 
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ
        );

        // 4. Trả về token và thông tin user
        res.status(200).json({
            message: 'Đăng nhập thành công',
            token: token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

exports.logout = (req, res) => {
    // Với JWT, việc logout chủ yếu là Client xóa token.
    // Backend chỉ cần gửi phản hồi xác nhận.
    // Nếu có cơ chế Blacklist token, logic sẽ phức tạp hơn.
    res.status(200).json({ message: 'Đăng xuất thành công. Vui lòng xóa token phía Client.' });
};