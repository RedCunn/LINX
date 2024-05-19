const Account = require('../schemas/Account');
const ChainRequest = require('../schemas/ChainRequest');
const chaining = require('./utils/chaining');

module.exports = {
    getMyChain: async (req, res, next) => {
        try {
            const _userid = req.params.userid;

            let _userAccount = await Account.findOne({ userid: _userid });

            const _myChainPromises = _userAccount.myChain.map(async (linx, i) => {
                const account = await Account.find({ userid: linx.userid });
                return account;
            })
            const accounts = await Promise.all(_myChainPromises);

            res.status(200).send({
                code: 0,
                error: null,
                message: 'Cadena recuperada',
                token: null,
                userdata: null,
                others: accounts.flat()
            })
        } catch (error) {
            res.status(200).send({
                code: 1,
                error: error.message,
                message: 'Error al recuperar cadena...',
                token: null,
                userdata: null,
                others: null
            })
        }
    },
    doChain: async (req, res, next) => {
        try {
            const userid = req.params.userid;
            const linxuserid = req.params.linxuserid;
            let joinReqState = 'REQUESTED';

            console.log('userid : ', userid)
            console.log('linxid :', linxuserid)

            let isChainRequested = await chaining.isJoinChainRequested(userid, linxuserid);

            if (isChainRequested.length > 0) {
                await chaining.joinChains(userid, linxuserid);
                joinReqState = 'ONCHAIN';
            } else {
                await chaining.doChainRequest(userid, linxuserid);
            }

            res.status(200).send({
                code: 0,
                error: null,
                message: joinReqState,
                token: null,
                userData: null,
                others: null
            })

        } catch (error) {
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'error haciendo cadena ...',
                token: null,
                userData: null,
                others: null
            })
        }
    },
    getJoinChainRequests: async (req, res, next) => {
        try {
            const userid = req.params.userid;
            const linxuserid = req.params.linxuserid;

            let joinRequest = null;

            let _chainReqs = await chaining.isJoinChainRequested(userid, linxuserid);

            console.log('CHAIN REQ : ', _chainReqs)

            if(_chainReqs.length > 0){
                joinRequest ={requested :  _chainReqs.at(0).requestedUserid, requesting : _chainReqs.at(0).requestingUserid};
            }

            res.status(200).send({
                code: 0,
                error: null,
                message: 'retrieved joinchain reqs...',
                token: null,
                userdata: null,
                others: joinRequest
            })
        } catch (error) {
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'error retrieving joinchain reqs...',
                token: null,
                userdata: null,
                others: null
            })
        }
    }
}