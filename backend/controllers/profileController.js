const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); // Cần để mã hóa mật khẩu nếu người dùng thay đổi

// 1. GET /profile (Xem thông tin cá nhân)
exports.viewProfile = async (req, res) => {
    try {
        // ID người dùng được lấy từ req.user (do middleware auth cung cấp)
        const userId = req.user.id; 
        
        // Tìm người dùng trong DB và loại bỏ trường password
        const user = await User.findById(userId).select('-password'); 

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy hồ sơ người dùng.' });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy hồ sơ.', error: error.message });
    }
};

// 2. PUT /profile (Cập nhật thông tin cá nhân)
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        let updates = req.body;

        // Nếu người dùng gửi password, phải mã hóa nó trước khi lưu
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        // Tìm và cập nhật người dùng. 
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $set: updates }, // $set chỉ cập nhật các trường được gửi
            { new: true, runValidators: true }
        ).select('-password'); // Loại bỏ password khỏi response

        if (!updatedUser) {
            return res.status(404).json({ message: 'Không tìm thấy hồ sơ để cập nhật.' });
        }
        
        res.status(200).json({ 
            message: 'Cập nhật hồ sơ thành công.',
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật hồ sơ.', error: error.message });
    }
};
