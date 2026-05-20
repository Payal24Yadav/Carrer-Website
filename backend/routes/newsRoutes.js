const express = require('express');
const {
  getNews,
  getNewsBySlug,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} = require('../controllers/newsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Public listing and Protected creation
router.route('/')
  .get(getNews)
  .post(protect, adminOnly, createNews);

// Admin-specific operations
router.delete('/delete/:id', protect, adminOnly, deleteNews);
router.put('/update/:id', protect, adminOnly, updateNews);
router.get('/id/:id', getNewsById);

// Slug resolution (Public)
router.route('/:slug')
  .get(getNewsBySlug);

module.exports = router;
