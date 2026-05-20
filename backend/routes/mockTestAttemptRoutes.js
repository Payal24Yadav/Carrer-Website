const express = require('express');
const { submitAttempt } = require('../controllers/mockTestAttemptController');

const router = express.Router();

router.post('/submit', submitAttempt);

module.exports = router;
