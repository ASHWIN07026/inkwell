const express = require('express');
const { deleteComment, toggleLike } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.delete('/:id', protect, deleteComment);
router.put('/:id/like', protect, toggleLike);
module.exports = router;
