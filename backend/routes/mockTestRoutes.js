const express = require('express');
const {
  getMockTests,
  getMockTestBySlug,
  getMockTestById,
  createMockTest,
  updateMockTest,
  deleteMockTest,
} = require('../controllers/mockTestController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Public listings and Admin protected creation
router.route('/')
  .get(getMockTests)
  .post(protect, adminOnly, createMockTest);

// Dynamic slug resolutions (Public)
router.get('/slug/:slug', getMockTestBySlug);

// Single retrieval by database ID
router.get('/id/:id', getMockTestById);

// Admin-specific operations (supporting standard REST and legacy explicit nested paths for total safety)
router.route('/:id')
  .put(protect, adminOnly, updateMockTest)
  .delete(protect, adminOnly, deleteMockTest);

router.put('/update/:id', protect, adminOnly, updateMockTest);
router.delete('/delete/:id', protect, adminOnly, deleteMockTest);

module.exports = router;
