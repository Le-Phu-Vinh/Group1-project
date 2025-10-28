// controllers/userController.js

const User = require('../models/User'); // Nhập User Model đã tạo
const bcrypt = require('bcryptjs'); // Thư viện để băm mật khẩu (nếu cần)

const jwt = require('jsonwebtoken');
// Cần định nghĩa SECRET KEY trong file cấu hình/biến môi trường
const JWT_SECRET = 'YOUR_SECRET_KEY'; // Cần thay đổi key này

// 1. GET /users (Lấy tất cả người dùng)
exports.getUsers = async (req, res) => {
    try {
        // Tìm và trả về tất cả tài liệu trong collection 'users'
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: error.message });
    }
};

// 2. POST /users (Tạo người dùng mới)
exports.createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Tạo một đối tượng User mới từ request body
        const newUser = new User({
            name,
            email
        });

        // Lưu đối tượng vào MongoDB
        const savedUser = await newUser.save();
        
        // Trả về đối tượng đã lưu với mã 201 Created
        res.status(201).json(savedUser);

    } catch (error) {
        // Xử lý lỗi trùng lặp email (error code 11000)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email đã tồn tại.' });
        }
        res.status(500).json({ message: 'Lỗi khi tạo người dùng mới', error: error.message });
    }
};

// 3. PUT /users/:id (Cập nhật người dùng)
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        
        // Tìm và cập nhật người dùng. 
        // { new: true } trả về tài liệu đã cập nhật, 
        // { runValidators: true } đảm bảo các quy tắc schema (như required, unique) được áp dụng.
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { 
            new: true, 
            runValidators: true 
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật.' });
        }
        
        // Trả về đối tượng đã cập nhật
        res.status(200).json(updatedUser);

    } catch (error) {
        // Xử lý lỗi validation hoặc lỗi server
        res.status(500).json({ message: 'Lỗi khi cập nhật người dùng.', error: error.message });
    }
};

// 4. DELETE /users/:id (Xóa người dùng)
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Tìm và xóa người dùng
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa.' });
        }
        
        // Trả về mã 204 No Content hoặc 200 OK cùng với thông báo
        res.status(200).json({ message: 'Người dùng đã được xóa thành công.', deletedUser });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa người dùng.', error: error.message });
    }
};

exports.signup = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // 1. Kiểm tra email trùng
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email đã tồn tại.' });
        }

        // 2. Mã hóa mật khẩu (bcrypt)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Tạo user mới
        user = new User({
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await user.save();

        res.status(201).json({ message: 'Đăng ký thành công.', user: { id: user._id, email: user.email } });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // 2. Xác thực mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // 3. Tạo JWT Token
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ
        );

        // 4. Trả về token và thông tin user
        res.status(200).json({
            message: 'Đăng nhập thành công.',
            token,
            user: { id: user._id, email: user.email, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

exports.logout = (req, res) => {
    // Backend chỉ cần gửi tín hiệu thành công.
    // Frontend sẽ chịu trách nhiệm xóa token khỏi Local Storage/Cookie.
    res.status(200).json({ message: 'Đăng xuất thành công. Token cần được xóa khỏi phía client.' });
};