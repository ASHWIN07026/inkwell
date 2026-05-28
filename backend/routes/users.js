const express = require('express');
const { getUser, getUserPosts, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.get('/:id', getUser);
router.get('/:id/posts', getUserPosts);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
module.exports = router;
