const express = require('express');
const router = express.Router();
const ChainController = require('../controllers/chain_controller');

router.get('/:userid', ChainController.getMyChain);
router.get('/:userid/extendedchain/:linxuserid', ChainController.getExtendedChainRoomKeys)
router.get('/:userid/chainreqs', ChainController.getJoinChainRequests);
router.post('/:userid/:linxuserid', ChainController.doChain);
router.delete('/:userid/mychain/:linxuserid', ChainController.breakChain);
router.delete('/:userid/chainreq/:linxuserid', ChainController.rejectJoinChainRequest)

module.exports = router;