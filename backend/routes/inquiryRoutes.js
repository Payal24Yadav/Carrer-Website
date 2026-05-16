const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  deleteInquiry,
  updateInquiry,
} = require('../controllers/inquiryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').post(createInquiry).get(protect, adminOnly, getInquiries);
router.route('/:id').put(protect, adminOnly, updateInquiry).delete(protect, adminOnly, deleteInquiry);

module.exports = router;
