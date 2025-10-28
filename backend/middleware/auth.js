const jwt = require('jsonwebtoken');
// Lấy SECRET KEY đã dùng trong API login
const JWT_SECRET = 'YOUR_SECRET_KEY'; 

module.exports = function(req, res, next) {
    // Lấy token từ header
    // Header thường có dạng: Authorization: Bearer <token>
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

    // Kiểm tra xem token có tồn tại không
    if (!token) {
        return res.status(401).json({ message: 'Không tìm thấy token, từ chối quyền truy cập.' });
    }

    try {
        // Xác thực token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Lưu thông tin người dùng (id và role) vào đối tượng request để các route sau có thể sử dụng
        req.user = decoded.user; // req.user sẽ chứa { id: user._id, role: user.role }
        
        next(); // Chuyển sang Controller tiếp theo

    } catch (err) {
        res.status(401).json({ message: 'Token không hợp lệ.' });
    }
};
