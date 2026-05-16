const express = require('express');
const router = express.Router();
const {
  getColleges,
  getCollegeBySlug,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege,
} = require('../controllers/collegeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(getColleges).post(protect, adminOnly, createCollege);

router.get('/slug/:slug', getCollegeBySlug);

// Specific ID routes
router.delete('/:id', protect, adminOnly, deleteCollege);
router.put('/:id', protect, adminOnly, updateCollege);
router.get('/:id', getCollegeById);

module.exports = router;
