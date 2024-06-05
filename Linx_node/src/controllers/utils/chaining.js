const { v4: uuidv4 } = require('uuid');
const ChainReq = require('../../schemas/ChainRequest');
const Account = require('../../schemas/Account');
const Match = require('../../schemas/Match');
const LinxExtent = require('../../schemas/LinxExtent');

module.exports = {
    isJoinChainRequested: async (userid, linxid, chainnames) => {
        try {
            let reqStates = new Map();

            for (const name of chainnames) {
                let isRequested = await ChainReq.find({
                    $or: [
                        { $and: [{ requestingUserid: userid }, { requestedUserid: linxid }, { chainName: name }] },
                        { $and: [{ requestingUserid: linxid }, { requestedUserid: userid }, { chainName: name }] }
                    ]
                });
        
                if(isRequested.length > 0){
                    reqStates.set(name , 'ACCEPTED')
                }else{
                    reqStates.set(name , 'REQUESTED')
                }
            }

            return reqStates;
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
    addingExtentToChain : async(userid, linxid , newlinxid, chainname) => {
        const session = await Account.startSession();
        session.startTransaction();
        try {
            let linxAccount = await Account.findOne({ userid: linxid })
            let userAccount = await Account.findOne({ userid: userid })
            let extentLinxid =  await Account.findOne({ userid: newlinxid })
            if (!linxAccount || !userAccount || !extentLinxid) {
                throw new Error('Account not found');
            }

            userAccount.myChain.forEach(chain => {
                if(chain.chainname === chainname){
                    extentLinxid.extendedChain.push({mylinxuserid : linxid, chainname : chainname, userid : chain.userid })
                }
            })

        } catch (error) {
            await session.abortTransaction();
            console.error('Error durante la transacción ADDING EXTENT To CHAIN:', error);
        }finally{
            session.endSession();
        }
    },
    joinChains: async (userid, linxid, chainname) => {
        const session = await Account.startSession();
        session.startTransaction();
        try {

            let linxAccount = await Account.findOne({ userid: linxid })
            let userAccount = await Account.findOne({ userid: userid })

            if (!linxAccount || !userAccount) {
                throw new Error('Account not found');
            }

            // vamos a tener que coger la llave del chat de su Match si son Match, y sino crear una 

            let roomkey = '';            

            // COMPROBAMOS SI ERAN MATCHES
            let match = await Match.findOne({
                $or: [
                    { $and: [{ userid_a: userid }, { userid_b: linxid }] },
                    { $and: [{ userid_a: linxid }, { userid_b: userid }] }
                ]
            })

            if(match){
                roomkey = match.roomkey;
            }else{
                roomkey = uuidv4();
            }

            // INCLUIMOS LA CHAIN DEL USER EN LA EXTENDEDCHAIN DEL LINX
        
            userAccount.myChain.forEach(chain => {
                if(chain.chainname === chainname){
                    linxAccount.extendedChain.push({mylinxuserid : userid, chainname : chainname, userid : chain.userid })
                }
            })
            
            // INCLUIMOS AL LINX EN LA CHAIN DEL USER
            let insertOnUserChain = await Account.updateOne({ userid: userid },
                { $push: { myChain: { chainname : chainname , userid: linxid, roomkey: roomkey } }}).session(session)

            // BORRAMOS LA PETICION DE UNIR CADENAS
            let removeChainReq = await ChainReq.deleteOne({
                $or:
                    [
                        { $and: [{ requestingUserid: userid }, { requestedUserid: linxid },{chainName : chainname}] },
                        { $and: [{ requestingUserid: linxid }, { requestedUserid: userid }, {chainName : chainname}] }
                    ]
            }).session(session)

            // SI FUERAN MATCHES BORRAMOS EL MATCH 
            if(match){
                let removeMatch = await Match.deleteOne({
                    $or: [
                        { $and: [{ userid_a: userid }, { userid_b: linxid }] },
                        { $and: [{ userid_a: linxid }, { userid_b: userid }] }
                    ]
                }).session(session)
            }

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
    breakChain : async (userid , linxuserid, chainid)=> {
        const session = await Account.startSession();
        session.startTransaction();
        try {
            
            let deleteFromMyLinxs = await Account.findOneAndDelete({myLinxs : {userid : linxuserid , chainid : chainid}}).session(session)
            let deleteLinxExtents = await LinxExtent.deleteMany({mylinxuserID : linxuserid , chainadminID : userid , chainID : chainid}).session(session)

            await session.commitTransaction();

            console.log('A BROKEN CHAIN IS NEVER HAPPY BUT DONE WITH SUCCESS')

        } catch (error) {
            await session.abortTransaction();
            console.error('Error durante la transacción BREAKING CHAINS:', error);
        }finally{
            session.endSession();
        }
    }
}
