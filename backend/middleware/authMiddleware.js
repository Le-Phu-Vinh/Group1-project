// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
// Giả định bạn có một model User để tìm kiếm người dùng sau khi giải mã token
const User = require('../models/User'); // Cần cập nhật đường dẫn chính xác

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key'; 


// Hàm Middleware để bảo vệ các route (endpoint)
const protect = async (req, res, next) => {
    let token;

    // 1. Kiểm tra header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header (dạng: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 2. Giải mã token
            // Thay 'YOUR_JWT_SECRET' bằng secret key thực tế của bạn
            const decoded = jwt.verify(token, JWT_SECRET ); 

            // 3. Tìm người dùng và gắn vào đối tượng request
            // .select('-password') để không bao gồm mật khẩu
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                 // Nếu token hợp lệ nhưng user không còn trong DB
                 return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // 🛑 THÊM BƯỚC 4: Kiểm tra xem user có đổi mật khẩu (hay thông tin quan trọng) sau khi token được cấp không
            if (user.passwordChangedAt) {
                const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
                
                // Nếu thời điểm thay đổi (changedTimestamp) LỚN HƠN thời điểm cấp token (decoded.iat)
                if (changedTimestamp > decoded.iat) {
                    return res.status(401).json({ message: 'Not authorized, password/info recently changed. Please log in again.' });
                }
            }

            // 4. Chuyển sang middleware hoặc controller tiếp theo 
            req.user = user; 
            next();
        } catch (error) {
            console.error(error);
            // Lỗi khi token không hợp lệ hoặc hết hạn
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // Nếu không có token trong header
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = protect ;