const express = require('express');
const router = express.Router();
const ChainController = require('../controllers/chain_controller');

router.get('/:userid', ChainController.getMyChain);
router.post('/:userid/:linxuserid', ChainController.chainLinxs);

module.exports = router;