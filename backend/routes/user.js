const express = require('express');
const router = express.Router();

// ✅ Gom tất cả các hàm từ userController vào một lệnh Destructuring DUY NHẤT.
// (Đảm bảo các hàm này được export tập trung bằng module.exports trong controller)
const { 
    getUsers, createUser, updateUser, deleteUser, 
    getProfile, updateProfile 
} = require('../controllers/userController');

// ✅ Import các hàm Auth
const { signup, login, logout } = require('../controllers/authController');

const protect = require('../middleware/authMiddleware'); // Middleware xác thực

// Route /profile (Đã bảo vệ)
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);
    

    // Các route Auth
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Định tuyến cho GET /users (CRUD)
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


    
module.exports = router;
