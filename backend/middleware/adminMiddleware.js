const admin = (req, res, next) => {
    // 1. Kiểm tra req.user đã được gán bởi protect middleware
    if (req.user && req.user.role === 'Admin') {
        // 2. Nếu là admin, cho phép tiếp tục
        next();
    } else {
        // 3. Nếu không phải admin, từ chối truy cập
        // Mã 403 Forbidden: Yêu cầu hợp lệ nhưng bị server từ chối vì không có quyền
        res.status(403).json({ 
            message: 'Forbidden: You do not have permission to perform this action (Admin access required).' 
        });
    }
};

module.exports = admin ;
