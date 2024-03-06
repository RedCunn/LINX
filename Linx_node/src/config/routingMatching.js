const express = require('express');
const router = express.Router();
const MatchingController = require('../controllers/matching_controller');

router.get('/shuffle', MatchingController.shuffleProfiles);

module.exports = router;