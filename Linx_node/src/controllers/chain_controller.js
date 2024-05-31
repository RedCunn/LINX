const Account = require('../schemas/Account');
const ChainRequest = require('../schemas/ChainRequest');
const chaining = require('./utils/chaining');
const Article = require('../schemas/Article');

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

            let artIDs = new Set();
            accounts.forEach(p => {
                if(p.articles !== undefined && p.articles.length > 0){
                    p.articles.forEach( artid => {
                        artIDs.add(artid)
                    })
                }
            }) 
            let artIDsToArray = Array.from(artIDs);
            let accountArticles = await Article.find({ articleid: { $in:  artIDsToArray} });

            res.status(200).send({
                code: 0,
                error: null,
                message: 'Cadena recuperada',
                token: null,
                userdata: accountArticles,
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
    getExtendedChain : async (req, res, next) => {
        try {
            const _userid = req.params.userid;
            const _mylinx = req.params.linxuserid;
            
            let _userAccount = await Account.findOne({ userid: _userid });
            
            let mylinxUserIds = new Set();
            for (const linx of _userAccount.extendedChain) {
                if (linx.mylinxuserid === _mylinx) {
                    mylinxUserIds.add(linx.mylinxuserid);
                }
            }
            let mylinxUserIdsArray = Array.from(mylinxUserIds);
            let accounts = await Account.find({ 'extendedChain.mylinxuserid': { $in: mylinxUserIdsArray } });

            let artIDs = new Set();
            accounts.forEach(p => {
                if(p.articles !== undefined && p.articles.length > 0){
                    p.articles.forEach( artid => {
                        artIDs.add(artid)
                    })
                }
            }) 
            let artIDsToArray = Array.from(artIDs);
            let accountArticles = await Article.find({ articleid: { $in:  artIDsToArray} });

            res.status(200).send({
                code: 0,
                error: null,
                message: 'Cadena recuperada',
                token: null,
                userdata: accountArticles,
                others: accounts
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
            let joinReqState = '';

            console.log('userid : ', userid)
            console.log('linxid :', linxuserid)

            let requestState = await chaining.isJoinChainRequested(userid, linxuserid);

            switch (requestState) {
                case 'NONE':
                    await chaining.doChainRequest(userid, linxuserid);
                    joinReqState = 'REQUESTING'
                    break;
                case 'REQUESTED':
                    await chaining.joinChains(userid, linxuserid);
                    joinReqState = 'ACCEPTED'
                    break;
                default:
                    break;
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
            let _chainReqs = await ChainRequest.find({ requestedUserid: userid })

            let _requestingIDs = [];
            _chainReqs.forEach(r => {
                _requestingIDs.push(r.requestingUserid)
            })

            let _accounts = await Account.find({ userid: { $in: _requestingIDs } });

            res.status(200).send({
                code: 0,
                error: null,
                message: 'retrieved joinchain reqs...',
                token: null,
                userdata: _chainReqs,
                others: _accounts
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
    },
    breakChain: async (req, res, next) => {

        try {
            const userid = req.params.userid;
            const linxuserid = req.params.linxuserid;

            await chaining.breakChain(userid, linxuserid);

            res.status(200).send({
                code: 0,
                error: null,
                message: 'BROKEN CHAIN',
                token: null,
                userdata: null,
                others: null
            })
        } catch (error) {
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'The chain was too strong...couldnt break',
                token: null,
                userdata: null,
                others: null
            })
        }
    },
    rejectJoinChainRequest: async (req, res, next) => {
        try {

            const userid = req.params.userid;
            const linxuserid = req.params.linxuserid;

            let deleteReq = await ChainRequest.deleteOne({ requestedUserid: userid, requestingUserid: linxuserid });

            console.log('REJECTED JOIN CHAIN REQ !!!', deleteReq)

            res.status(200).send({
                code: 0,
                error: null,
                message: 'User rejected the join chain request.',
                token: null,
                userdata: null,
                others: null
            })
        } catch (error) {
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'Couldnt complete rejection of join chain request.....',
                token: null,
                userdata: null,
                others: null
            })
        }
    }
}