const { v4: uuidv4 } = require('uuid');
const ChainReq = require('../../schemas/ChainRequest');
const Account = require('../../schemas/Account');
const Match = require('../../schemas/Match');

module.exports = {
    isJoinChainRequested: async (userid, linxid) => {
        try {
            let reqState = 'NONE';
            let isRequested = await ChainReq.find({
                $or:
                    [
                        { $and: [{ requestingUserid: userid }, { requestedUserid: linxid }] },
                        { $and: [{ requestingUserid: linxid }, { requestedUserid: userid }] }
                    ]
            })

            if(isRequested.length > 0){
                reqState = 'REQUESTED';
            }
            console.log('CHAIN REQ STATE...', reqState);
            return reqState;
        } catch (error) {
            console.log('error selecting isRequested...', error)
        }
    },
    doChainRequest: async (userid, linxid) => {
        try {
            let insertResult = await ChainReq.create({ requestingUserid: userid, requestedUserid: linxid })
            console.log('result of insertion on ChainRequests: ', insertResult)
            return insertResult;
        } catch (error) {
            console.log('result ERROR of insertion on ChainRequests: ', error)
        }
    },
    joinChains: async (userid, linxid) => {
        const session = await Account.startSession();
        session.startTransaction();
        try {

            let linxAccount = await Account.findOne({ userid: linxid })
            let userAccount = await Account.findOne({ userid: userid })

            let match = await Match.findOne({
                $or: [
                    { $and: [{ userid_a: userid }, { userid_b: linxid }] },
                    { $and: [{ userid_a: linxid }, { userid_b: userid }] }
                ]
            })

            linxAccount.myChain.forEach(l => {
                const _roomkey = uuidv4();
                userAccount.extendedChain.push({mylinxuserid : linxid, userid : l.userid, roomkey : _roomkey})
            })

            userAccount.myChain.forEach(l => {
                const _roomkey = uuidv4();
                userAccount.extendedChain.push({mylinxuserid : userid, userid : l.userid, roomkey : _roomkey})
            })

            let insertOnUserChain = await Account.updateOne({ userid: userid },
                { $push: { myChain: { userid: linxid, roomkey: match.roomkey } }}).session(session)
            let insertOnLinxChain = await Account.updateOne({ userid: linxid },
                { $push: { myChain: { userid: userid, roomkey: match.roomkey } } }).session(session)

            let removeChainReq = await ChainReq.deleteOne({
                $or:
                    [
                        { $and: [{ requestingUserid: userid }, { requestedUserid: linxid }] },
                        { $and: [{ requestingUserid: linxid }, { requestedUserid: userid }] }
                    ]
            }).session(session)

            let removeMatch = await Match.deleteOne({
                $or: [
                    { $and: [{ userid_a: userid }, { userid_b: linxid }] },
                    { $and: [{ userid_a: linxid }, { userid_b: userid }] }
                ]
            }).session(session)

            await userAccount.save({ session: session });
            await linxAccount.save({ session: session });

            await session.commitTransaction();

            console.log('LINXS JOINED TO CHAIN SUCCESFULLY')
        } catch (error) {
            await session.abortTransaction();
            console.error('Error durante la transacción JOINING CHAINS:', error);
        }finally{
            session.endSession();
        }
    },
    breakChain : async (userid , linxuserid)=> {
        const session = await Account.startSession();
        session.startTransaction();
        try {
            await Account.updateOne(
                { userid: userid },
                { $pull: { "extendedChain": { mylinxuserid: linxuserid } } }
              ).session(session);
            await Account.updateOne(
                { userid: linxuserid },
                { $pull: { "extendedChain": { mylinxuserid: userid } } }
              ).session(session);
              
            await Account.updateOne(
            { "myChain.userid": linxuserid },
            { $pull: { "myChain": { userid: linxuserid } } }
            ).session(session);  
            await Account.updateOne(
            { "myChain.userid": userid },
            { $pull: { "myChain": { userid: userid } } }
            ).session(session);

            await session.commitTransaction();

            console.log('SUCCESFULLY BROKEN CHAIN')

        } catch (error) {
            await session.abortTransaction();
            console.error('Error durante la transacción BREAKING CHAINS:', error);
        }finally{
            session.endSession();
        }
    }
}
