const express = require('express');
const router = express.Router();
const MatchingController = require('../controllers/matching_controller');
router.post('/signin', MatchingController.signin);

module.exports = router;