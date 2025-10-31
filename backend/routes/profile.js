const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Nhập middleware
const profileController = require('../controllers/profileController');

// GET /profile: Cần middleware xác thực (auth)
router.get('/', auth, profileController.viewProfile);

// PUT /profile: Cần middleware xác thực (auth)
router.put('/', auth, profileController.updateProfile);

module.exports = router;