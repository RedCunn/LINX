const mongoose = require('mongoose');

let ChainReqSchema = new mongoose.Schema ({
    requestingUserid: { type : String},
    requestedUserid: {type : String},
    chain : {
        chainId : {type : String},
        chainName : {type : String, default : 'Mejores amigxs'}
    },
    requestedAt : {type : Date, default : Date.now}
})

module.exports = mongoose.model('ChainRequest', ChainReqSchema, 'ChainRequests');