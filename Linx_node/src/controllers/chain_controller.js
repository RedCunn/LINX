const Account = require('../schemas/Account');
const ChainRequest = require('../schemas/ChainRequest');
const chaining = require('./utils/chaining');
const Article = require('../schemas/Article');

module.exports = {
    getMyLinxs: async (req, res, next) => {
        try {
            const _userid = req.params.userid;
            const _chainid = req.params.chainid;

            let _userAccount = await Account.findOne({ userid: _userid });
            
            let  _myLinxPromises ; 
            if(_chainid === 'null'){
                _myLinxPromises  = _userAccount.myLinxs.map(async (linx, i) => {
                    const account = await Account.findOne({ userid: linx.userid });
                    return account;
                })
            }else{
                 _myLinxPromises  = _userAccount.myLinxs.map(async (linx, i) => {
                    if(linx.chainid === _chainid){
                        const account = await Account.findOne({ userid: linx.userid });
                        return account;
                    }
                })
            }
            
            const accounts = await Promise.all(_myLinxPromises);            

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
    doChain: async (req, res, next) => {
        try {
            const userid = req.params.userid;
            const linxuserid = req.params.linxuserid;
            const {chainnames} = req.body;

            let joinReqState = '';

            console.log('userid : ', userid)
            console.log('linxid :', linxuserid)

            let requestStates = await chaining.isJoinChainRequested(userid, linxuserid, chainnames);

            for (const [key , value] of requestStates) {
                if(value === 'ACCEPTED'){
                    await chaining.joinChains(userid, linxuserid, key);   
                    joinReqState = joinReqState + ' / ACCEPTED : ' + key
                }
                if(value === 'REQUESTED'){
                    await chaining.doChainRequest(userid, linxuserid, key);
                    joinReqState = joinReqState + ' / REQUESTED : ' + key
                }
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
            let _chainReqsUserRequested = await ChainRequest.find({ requestedUserid: userid })
            let _chainReqsUserRequesting = await ChainRequest.find({ requestingUserid: userid })

            let _requestingIDs = [];
            _chainReqsUserRequested.forEach(r => {
                _requestingIDs.push(r.requestingUserid)
            })
            let _requestingAccounts = await Account.find({ userid: { $in: _requestingIDs } });

            let _requestedIDs = [];
            _chainReqsUserRequesting.forEach(r => {
                _requestedIDs.push(r.requestedUserid)
            })
            let _requestedAccounts = await Account.find({ userid: { $in: _requestedIDs } });

            let _requestingAccountsArticles = await Article.find({userid : {$in : _requestingIDs} })

            let requestingAccounts = {accounts : _requestingAccounts, reqs : _chainReqsUserRequested, articles : _requestingAccountsArticles};
            let requestedAccounts = {accounts : _requestedAccounts, reqs: _chainReqsUserRequesting};

            res.status(200).send({
                code: 0,
                error: null,
                message: 'retrieved joinchain reqs...',
                token: null,
                userdata: requestedAccounts,
                others: requestingAccounts
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
            const chainid = req.params.chainid;

            await chaining.breakChain(userid, linxuserid, chainid);

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
    confirmJoinChainRequest: async (req, res, next) => {
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