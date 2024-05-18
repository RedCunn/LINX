const express = require('express');
const router = express.Router();
const ChainController = require('../controllers/chain_controller');

router.get('/:userid', ChainController.getMyChain);
router.get('/:userid/chainreq/:linxuserid', ChainController.getMyChain);
router.post('/:userid/:linxuserid', ChainController.doChain);

module.exports = router;