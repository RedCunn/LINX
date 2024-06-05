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

            // COMPROBAMOS SI ESTABAN INCLUIDOS EN EXTENDEDCHAIN            
            let searchExtentOnLinx = linxAccount.extendedChain.findIndex(ext => ext.userid === userid)
            if(searchExtentOnLinx !== -1){
                await Account.updateOne(
                    { userid: linxid },
                    { $pull: { extendedChain: { userid: userid } } },
                    { session }
                );
            }
            let searchExtentOnUser = userAccount.extendedChain.findIndex(ext => ext.userid === linxid)
            if(searchExtentOnUser !== -1){
                await Account.updateOne(
                    { userid: userid },
                    { $pull: { extendedChain: { userid: linxid } } },
                    { session }
                );
            }

            // INCLUIMOS LA CHAIN DEL LINX EN LA EXTENDED CHAIN DEL USER
            linxAccount.myChain.forEach(l => {
                userAccount.extendedChain.push({mylinxuserid : linxid, userid : l.userid})
            })
            // INCLUIMOS LA CHAIN DEL USER EN LA EXTENDED CHAIN DEL LINX
            userAccount.myChain.forEach(l => {
                linxAccount.extendedChain.push({mylinxuserid : userid, userid : l.userid})
            })

            // INCLUIMOS AL LINX EN LA CHAIN DEL USER
            let insertOnUserChain = await Account.updateOne({ userid: userid },
                { $push: { myChain: { userid: linxid, roomkey: roomkey } }}).session(session)

            // INCLUIMOS AL USER EN LA CHAIN DEL LINX
            let insertOnLinxChain = await Account.updateOne({ userid: linxid },
                { $push: { myChain: { userid: userid, roomkey: roomkey } } }).session(session)

            console.log('INSERT ON USER CHAIN : ', insertOnUserChain)
            console.log('INSERT ON LINX CHAIN : ', insertOnLinxChain)

            // BORRAMOS LA PETICION DE UNIR CADENAS
            let removeChainReq = await ChainReq.deleteOne({
                $or:
                    [
                        { $and: [{ requestingUserid: userid }, { requestedUserid: linxid }] },
                        { $and: [{ requestingUserid: linxid }, { requestedUserid: userid }] }
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
