const express = require('express');
const router = express.Router();
const {
  createCollegePartner,
  getCollegePartners,
  deleteCollegePartner,
  createConsultantPartner,
  getConsultantPartners,
  deleteConsultantPartner,
} = require('../controllers/partnerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// College routes
router.post('/college', createCollegePartner);
router.route('/college').get(protect, adminOnly, getCollegePartners);
router.route('/college/:id').delete(protect, adminOnly, deleteCollegePartner);

// Consultant routes
router.post('/consultant', createConsultantPartner);
router.route('/consultant').get(protect, adminOnly, getConsultantPartners);
router.route('/consultant/:id').delete(protect, adminOnly, deleteConsultantPartner);

module.exports = router;
