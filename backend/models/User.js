const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Phải dùng 'bcryptjs' để đồng bộ với controller/login
const crypto = require('crypto');

// Định nghĩa cấu trúc dữ liệu cho Collection 'users'
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Đảm bảo email không trùng lặp
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Vui lòng sử dụng định dạng email hợp lệ']
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false // Rất QUAN TRỌNG: Không trả về trường này theo mặc định
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user'
    },
    avatar: {
        type: String,
        default: 'https://placehold.co/150x150/000000/FFFFFF?text=Avatar' // Placeholder
    },
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true 
});

// Middleware Mongoose để hash mật khẩu trước khi lưu (Signup)
UserSchema.pre('save', async function(next) {
    // Chỉ hash nếu mật khẩu đã được thay đổi (lần đầu tạo hoặc khi đổi password)
    if (!this.isModified('password')) return next();
    
    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Gán lại passwordConfirm = undefined nếu có (để không lưu vào DB)
    // if (this.passwordConfirm) this.passwordConfirm = undefined; 
    
    next();
});

// Phương thức Instance để so sánh mật khẩu (Login)
UserSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    // candidatePassword: Mật khẩu người dùng nhập
    // userPassword: Mật khẩu đã hash trong DB (this.password)
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Phương thức để tạo token reset mật khẩu
UserSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 phút
    return resetToken;
};

// Xuất ra model để sử dụng trong controller
module.exports = mongoose.model('User', UserSchema);
