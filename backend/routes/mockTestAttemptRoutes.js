const express = require('express');
const { submitAttempt, getAttemptById } = require('../controllers/mockTestAttemptController');

const router = express.Router();

router.post('/submit', submitAttempt);
router.get('/:id', getAttemptById);

module.exports = router;
