const express = require('express');
const router = express.Router();
const MatchingController = require('../controllers/matching_controller');

router.post('/shuffle', MatchingController.shuffleProfiles);

module.exports = router;