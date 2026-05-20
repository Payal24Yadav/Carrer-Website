const express = require('express');
const {
  createMockTestRegistration,
  getMockTestRegistrations,
  deleteMockTestRegistration,
} = require('../controllers/mockTestRegistrationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(createMockTestRegistration)
  .get(protect, adminOnly, getMockTestRegistrations);

router.route('/:id')
  .delete(protect, adminOnly, deleteMockTestRegistration);

module.exports = router;
