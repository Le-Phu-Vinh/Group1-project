const express = require('express');
const router = express.Router();

// ✅ Gom tất cả các hàm từ userController vào một lệnh Destructuring DUY NHẤT.
// (Đảm bảo các hàm này được export tập trung bằng module.exports trong controller)
const { 
    getUsers, createUser, updateUser, deleteUser, 
    getProfile, updateProfile, 
    uploadAvatar
} = require('../controllers/userController');

// ✅ Import các hàm Auth
const { signup, login, logout, resetPassword, forgotPassword } = require('../controllers/authController');

const protect = require('../middleware/authMiddleware'); // Middleware xác thực

const admin = require('../middleware/adminMiddleware'); // Middleware kiểm tra quyền Admin

// Route /profile (Đã bảo vệ)
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);
    

    // Các route Auth
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.patch('/reset-password/:token', resetPassword);
router.post('/forgot-password/', forgotPassword);





// 3. Upload Avatar (Yêu cầu xác thực)
// @route   PUT /users/upload-avatar
// @access  Private
router.put('/upload-avatar', protect, uploadAvatar);

// 1. GET /users: Chỉ Admin được xem danh sách người dùng
router.get('/', protect, admin, getUsers); 

// 2. POST /users: ÁP DỤNG RBAC
router.post('/', protect, admin, createUser); 

// 3. PUT /:id: ÁP DỤNG RBAC
router.put('/:id', protect, admin, updateUser); 

// 4. DELETE /:id: ÁP DỤNG RBAC
router.delete('/:id', protect, admin, deleteUser); 

    
module.exports = router;
