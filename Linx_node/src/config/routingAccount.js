const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/account_controller');

router.get('/trackLocationGeocode', AccountController.trackLocationGeocode);
router.post('/signup', AccountController.signup);
router.post('/singin', AccountController.signin);

module.exports = router;