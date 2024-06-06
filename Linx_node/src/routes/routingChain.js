const express = require('express');
const router = express.Router();
const ChainController = require('../controllers/chain_controller');

router.get('/:userid/chain/:chainid', ChainController.getMyLinxs);

router.get('/:userid/chainreqs', ChainController.getJoinChainRequests);
router.post('/:userid/:linxuserid', ChainController.doChain);
router.delete('/:userid/chain/:chainid/linx/:linxuserid', ChainController.breakChain);
router.post('/:userid/chainreq/:linxuserid', ChainController.confirmJoinChainRequest)
router.get('/:userid/extents/:linxuserid', ChainController.getChainLinxExtents)
module.exports = router;