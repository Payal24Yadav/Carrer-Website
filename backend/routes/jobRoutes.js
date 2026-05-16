const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, adminOnly, createJob);

// Specific ID routes
router.delete('/:id', protect, adminOnly, deleteJob);
router.put('/:id', protect, adminOnly, updateJob);
router.get('/:id', getJob);

module.exports = router;
