const express = require('express');
const {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
} = require('../controllers/internshipController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Public listing and Protected creation
router.route('/')
  .get(getInternships)
  .post(protect, adminOnly, createInternship);

// CRUD operations (supporting both standard REST and explicit update/delete sub-paths for redundancy safety)
router.route('/:id')
  .get(getInternshipById)
  .put(protect, adminOnly, updateInternship)
  .delete(protect, adminOnly, deleteInternship);

router.delete('/delete/:id', protect, adminOnly, deleteInternship);
router.put('/update/:id', protect, adminOnly, updateInternship);

module.exports = router;
