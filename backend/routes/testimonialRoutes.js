const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(getTestimonials).post(protect, adminOnly, createTestimonial);
router.route('/:id').put(protect, adminOnly, updateTestimonial).delete(protect, adminOnly, deleteTestimonial);

module.exports = router;
