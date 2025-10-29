// controllers/userController.js

const User = require('../models/User'); // Nhập User Model đã tạo

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