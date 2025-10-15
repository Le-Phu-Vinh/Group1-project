const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Định nghĩa route cho /users

// GET /users: Lấy danh sách tất cả người dùng
router.get('/', userController.getAllUsers);

// POST /users: Tạo người dùng mới
router.post('/', userController.createUser);

module.exports = router;