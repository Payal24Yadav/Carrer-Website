const express = require('express');
const router = express.Router();
const {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} = require('../controllers/programController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(getPrograms).post(protect, adminOnly, createProgram);
router.route('/:id').get(getProgramById).put(protect, adminOnly, updateProgram).delete(protect, adminOnly, deleteProgram);

module.exports = router;
