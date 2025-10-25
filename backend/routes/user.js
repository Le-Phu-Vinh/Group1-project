// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Định tuyến cho GET /users (Đã được tiền tố bằng app.use('/users', ...) trong server.js)
router.get('/', userController.getUsers);

// Định tuyến cho POST /users
router.post('/', userController.createUser);

// PUT /users/:id (API cập nhật)
router.put('/:id', userController.updateUser);

// DELETE /users/:id (API xóa)
router.delete('/:id', userController.deleteUser);

module.exports = router;