const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all blogs and Create (Protected)
router.route('/').get(getBlogs).post(protect, adminOnly, createBlog);

// Important: Specific routes before generic ones
router.delete('/delete/:id', protect, adminOnly, deleteBlog);
router.put('/update/:id', protect, adminOnly, updateBlog);

// Slug route
router.route('/:slug').get(getBlogBySlug);

module.exports = router;
