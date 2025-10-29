const User = require('../models/User'); // Nhập User Model đã tạo
// Cần nhập bcrypt cho updateProfile
const bcrypt = require('bcrypt'); 

// 1. ✅ SỬA: Thay thế 'exports.getUsers' bằng 'const getUsers'
const getUsers = async (req, res) => {
    try {
        // Tìm và trả về tất cả tài liệu trong collection 'users'
        const users = await User.find().select('-password'); // Bỏ mật khẩu
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: error.message });
    }
};

// 2. ✅ SỬA: Thay thế 'exports.createUser' bằng 'const createUser'
// Lưu ý: Hàm này cần hash mật khẩu nếu bạn muốn tạo user bằng API này
const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        // Bỏ logic tạo user đơn giản, vì authController đã có signup
        res.status(501).json({ message: 'Use POST /users/signup for user creation.' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo người dùng mới', error: error.message });
    }
};

// 3. ✅ SỬA: Thay thế 'exports.updateUser' bằng 'const updateUser'
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        
        // Cần xử lý hash mật khẩu nếu nó là một trường được cập nhật
        if (updates.password) {
             const salt = await bcrypt.genSalt(10);
             updates.password = await bcrypt.hash(updates.password, salt);
        }
        
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { 
            new: true, 
            runValidators: true 
        }).select('-password');

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

// 4. ✅ SỬA: Thay thế 'exports.deleteUser' bằng 'const deleteUser'
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Tìm và xóa người dùng
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa.' });
        }
        
        // Trả về mã 200 OK cùng với thông báo
        res.status(200).json({ message: 'Người dùng đã được xóa thành công.', deletedUser });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa người dùng.', error: error.message });
    }
};

// @desc    Lấy hồ sơ người dùng
// @route   GET /users/profile
// @access  Private
const getProfile = async (req, res) => {
    // 1. KIỂM TRA BẢO VỆ: Nếu middleware thất bại hoặc không gán user, dừng ngay lập tức.
    if (!req.user || !req.user._id) { 
        // Đây là kiểm tra bảo vệ, lỗi 500 sẽ không xảy ra nữa
        return res.status(401).json({ message: 'Not authorized: User object is missing or invalid.' });
    }

    // 2. SỬ DỤNG TRỰC TIẾP req.user (đã được lấy từ DB trong middleware)
    // Loại bỏ lệnh User.findById() dư thừa
    const user = req.user; 
    
    // 3. Trả về dữ liệu
    res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar, 
        role: user.role,
    });
};

// @desc    Cập nhật hồ sơ người dùng
// @route   PUT /users/profile
// @access  Private
const updateProfile = async (req, res) => {
    // 1. KIỂM TRA BẢO VỆ
    if (!req.user || !req.user._id) { 
        return res.status(401).json({ message: 'Not authorized: User object is missing or invalid.' });
    }
    
    // 2. Lấy user từ DB để cập nhật
    const user = await User.findById(req.user._id);

    if (user) {
        // Cập nhật các trường được gửi từ request body
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.avatar = req.body.avatar || user.avatar; 

        // 3. Xử lý cập nhật mật khẩu (Hash nó)
        if (req.body.password) {
             const salt = await bcrypt.genSalt(10);
             user.password = await bcrypt.hash(req.body.password, salt);
        }
        
        const updatedUser = await user.save();

        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            message: 'Profile updated successfully',
        });
    } else {
        // Fallback (thực tế không thể xảy ra nếu middleware hoạt động)
        res.status(404).json({ message: 'User not found' }); 
    }
};


// module.exports đã đúng vì tất cả các hàm giờ đều là biến 'const'
module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getProfile,
    updateProfile,
};
