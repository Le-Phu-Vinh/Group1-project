const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email'); // Giữ nguyên, cần cho tính năng khác
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

const cloudinary = require('cloudinary').v2; // Cần thiết cho Upload Avatar

exports.signup = async (req, res) => {
    try {
        const { email, password, name } = req.body; 

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ email, mật khẩu và tên.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại.' });
        }

        // Tạo user mới, Mongoose Pre-save Hook sẽ TỰ ĐỘNG HASH MẬT KHẨU
        const newUser = new User({
            email,
            password, 
            name,
            role: 'user' 
        });
        await newUser.save();

        // Tự động đăng nhập sau khi đăng ký
        const token = generateToken(newUser._id, newUser.role); // Dùng generateToken mới

        res.status(201).json({ 
            message: 'Đăng ký thành công!',
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Lỗi Signup:", error); 
        if (error.name === 'ValidationError') {
             return res.status(400).json({ message: 'Lỗi validation.', error: error.message });
        }
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// @desc    Đăng nhập
// @route   POST /users/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu.' });
        }
        
        // 1. Tìm User (cần +password để lấy mật khẩu đã hash)
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }
        
        // 2. Xác thực mật khẩu
        const isMatch = await user.correctPassword(password, user.password); 
        
        console.log(`[DEBUG] Mật khẩu đã hash từ DB (user.password): ${user.password}`);
        console.log(`[DEBUG] Kết quả so sánh (isMatch): ${isMatch}`);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // 3. Tạo JWT token
        const token = generateToken(user._id, user.role); // Dùng generateToken mới

        // 4. Trả về token và thông tin user
        user.password = undefined; // Loại bỏ mật khẩu trước khi trả về
        
        res.status(200).json({
            message: 'Đăng nhập thành công',
            token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Lỗi Login:", error);
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// @desc    Quên mật khẩu (Gửi email chứa token reset)
// @route   POST /users/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            // Lỗi này xảy ra khi req.body không được parse (thiếu body-parser)
            return res.status(400).json({ message: 'Vui lòng cung cấp email.' }); 
        }

        // 1. Tìm user bằng email
        const user = await User.findOne({ email });

        if (!user) {
            // Trả về 200 OK để tránh lộ thông tin user nào tồn tại
            return res.status(200).json({ 
                message: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.' 
            });
        }

        // 2. Tạo token reset
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false }); // Tắt validation khi lưu token

        // 3. Tạo URL reset
        // Token KHÔNG ĐƯỢC HASH được gửi qua email
        const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        
        const message = `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu. Vui lòng truy cập đường link sau:
         ${resetURL}\n\nĐường link này sẽ hết hạn sau 10 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.`;

        try {
            // 4. Gửi email
            await sendEmail({
                email: user.email,
                subject: 'Yêu cầu đặt lại mật khẩu (Có hiệu lực 10 phút)',
                message
            });

            res.status(200).json({
                message: 'Đã gửi token reset mật khẩu đến email!',
                // Chỉ nên hiển thị resetToken trong môi trường Dev/Test
                resetToken // <-- Xóa dòng này khi deploy Production
            });

        } catch (emailError) {
            // Nếu gửi email lỗi, xóa token trong DB
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            console.error("Lỗi gửi email:", emailError);
            return res.status(500).json({ 
                message: 'Lỗi khi gửi email đặt lại mật khẩu. Vui lòng thử lại sau.' 
            });
        }

    } catch (error) {
        console.error("Lỗi Forgot Password:", error);
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// @desc    Đặt lại mật khẩu
// @route   PATCH /users/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, passwordConfirm } = req.body;

        // 1. Hash token nhận được từ URL
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // 2. Tìm user bằng token đã hash và đảm bảo token chưa hết hạn
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() } // $gt: greater than
        });

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }

        // 3. Kiểm tra mật khẩu mới
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
        }
        if (password !== passwordConfirm) {
            return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp.' });
        }

        // 4. Cập nhật mật khẩu
        user.password = password; // Mongoose middleware pre('save') sẽ tự động hash
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save(); // Lệnh save này sẽ kích hoạt pre('save') để hash mật khẩu

        // 5. Tự động đăng nhập lại sau khi reset
        const authToken = generateToken(user._id, user.role); // Dùng generateToken mới

        res.status(200).json({
            message: 'Đặt lại mật khẩu thành công!',
            token: authToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Lỗi Reset Password:", error);
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// @desc    Đăng xuất (Client-side)
// @route   POST /users/logout
// @access  Public
exports.logout = (req, res) => {
    // Về cơ bản, logout là việc xóa token phía client.
    res.status(200).json({ message: 'Đăng xuất thành công. Vui lòng xóa token phía Client.' });
};

// 9. Upload Avatar
exports.uploadAvatar = async (req, res) => {
    // Logic Upload Avatar
    try {
        const fileToUpload = req.body.image; 

        if (!fileToUpload) {
            return res.status(400).json({ message: 'Không tìm thấy file ảnh để tải lên.' });
        }

        const result = await cloudinary.uploader.upload(fileToUpload, {
            folder: 'user_avatars', 
            public_id: `avatar_${req.user._id}`, 
            overwrite: true,
        });

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        user.avatar = result.secure_url; 
        user.passwordChangedAt = Date.now();
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            message: 'Avatar đã được cập nhật thành công.',
            avatarUrl: result.secure_url,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: result.secure_url
            }
        });

    } catch (error) {
        console.error('Lỗi Upload Avatar:', error);
        res.status(500).json({ message: 'Lỗi khi tải ảnh lên Cloudinary.', error: error.message });
    }
};

// Exports tất cả các hàm
module.exports = {
    signup: exports.signup,
    login: exports.login,
    logout: exports.logout,
    forgotPassword: exports.forgotPassword,
    resetPassword: exports.resetPassword,
    uploadAvatar: exports.uploadAvatar,
};
