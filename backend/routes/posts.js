const express = require('express');
const { body } = require('express-validator');
const { getPosts, getPost, createPost, updatePost, deletePost, toggleLike } = require('../controllers/postController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect, optionalAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPost);
router.post('/', protect, [
  body('title').trim().isLength({ min: 5, max: 150 }).withMessage('Title must be 5-150 characters'),
  body('content').isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),
  body('category').isIn(['Technology','Design','Science','Lifestyle','Culture','Business','Health']).withMessage('Invalid category'),
], createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, toggleLike);

router.get('/:postId/comments', getComments);
router.post('/:postId/comments', protect, [
  body('content').trim().notEmpty().withMessage('Comment cannot be empty'),
], addComment);

module.exports = router;
