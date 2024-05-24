const express = require('express');
const router = express.Router();
const ChainController = require('../controllers/chain_controller');

router.get('/:userid', ChainController.getMyChain);
router.get('/:userid/chainreqs', ChainController.getJoinChainRequests);
router.post('/:userid/:linxuserid', ChainController.doChain);
router.delete('/:userid/:linxuserid', ChainController.breakChain);

module.exports = router;