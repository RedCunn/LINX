const mongoose = require('mongoose');

let ChainReqSchema = new mongoose.Schema ({
    requestingUserid: { type : String},
    requestedUserid: {type : String},
    requestedAt : {type : Date, default : Date.now}
})

module.exports = mongoose.model('ChainRequest', ChainReqSchema, 'ChainRequests');