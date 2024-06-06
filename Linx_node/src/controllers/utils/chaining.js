const { v4: uuidv4 } = require('uuid');
const ChainReq = require('../../schemas/ChainRequest');
const Account = require('../../schemas/Account');
const Match = require('../../schemas/Match');
const LinxExtent = require('../../schemas/LinxExtent');

module.exports = {
    isJoinChainRequested: async (userid, linxid, chains) => {
        try {
            let reqStates = new Map();

            for (const [key , value] of chains) {

                if(key === 'new'){
                    const _chainid = uuidv4();
                    reqStates.set(_chainid , {name : value, state : 'REQUESTED'})
                }else{
                    let isRequested = await ChainReq.find({
                        $or: [
                            { $and: [{ requestingUserid: userid }, { requestedUserid: linxid }, { 'chain.chainId': key}] },
                            { $and: [{ requestingUserid: linxid }, { requestedUserid: userid }, {'chain.chainId': key }] }
                        ]
                    });

                    if(isRequested.length > 0){
                        reqStates.set(key , {name : value, state : 'ACCEPTED'})
                    }else{
                        reqStates.set(key , {name : value, state : 'REQUESTED'})
                    }   
                }
                
            }
            console.log('REQUEST STATES : ', reqStates)
            return reqStates;
        } catch (error) {
            console.log('error selecting isRequested...', error)
        }
    },
    doChainRequest: async (userid, linxid, chainid , chainname) => {
        try {
            let insertResult = await ChainReq.create({ requestingUserid: userid, requestedUserid: linxid , chain : {chainid : chainid , chainname : chainname}})
            console.log('result of insertion on ChainRequests: ', insertResult)
            return insertResult;
        } catch (error) {
            console.log('result ERROR of insertion on ChainRequests: ', error)
        }
    },
    retrieveChainLinxExtents : async (userid , linxid) => {
        try {
            let extents = [];
            if(linxid !== null){
                extents = await LinxExtent.find({mylinxuserID : linxid , chainadminID : userid})
            }else{
                extents = await LinxExtent.find({chainadminID : userid})
            }
            return extents;
        } catch (error) {
            console.log('ERROR RECUPERANDO EXTENTS : ', error)
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
    joinChains: async (userid, linxid, chainid, chainname) => {
        const session = await Account.startSession();
        session.startTransaction();
        try {

            let linxAccount = await Account.findOne({ userid: linxid })
            let userAccount = await Account.findOne({ userid: userid })

            if (!linxAccount || !userAccount) {
                throw new Error('Account not found');
            }

            // vemos si está creada ya la cadena o es nueva 

            const chainIndex = userAccount.myChains.findIndex(chain => chain.chainid === chainid)
            let insertChain;
            if(chainIndex === -1 ){
                const _chainid = uuidv4();              
                insertChain = await Account.findOneAndUpdate(
                    { userid: userid },
                    { $push: { myChains: { chainid: _chainid, chainname: chainname } } },
                    { new: true, upsert: true }
                  );
            }else{
                insertChain = userAccount.myChains[chainIndex];
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
        
            linxAccount.extendedChains.push({chainadminid : userid , chainid : insertChain.chainid , chainname : insertChain.chainname })
            
            // INCLUIMOS AL LINX EN LXS LINXS DEL USER
            userAccount.myLinxs.push({chainid : chainid , userid : linxAccount.userid , roomkey : roomkey})

            // BORRAMOS LA PETICION DE UNIR CADENAS
            let removeChainReq = await ChainReq.deleteOne({
                $or:
                    [
                        { $and: [{ requestingUserid: userid }, { requestedUserid: linxid },{chainid : chainid}] },
                        { $and: [{ requestingUserid: linxid }, { requestedUserid: userid }, {chainid : chainid}] }
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
