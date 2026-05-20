const express = require('express');
const {
  getQuestionsForTest,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/test/:testId', getQuestionsForTest);

router.route('/')
  .get(protect, adminOnly, getQuestions)
  .post(protect, adminOnly, createQuestion);

router.route('/:id')
  .put(protect, adminOnly, updateQuestion)
  .delete(protect, adminOnly, deleteQuestion);

module.exports = router;
