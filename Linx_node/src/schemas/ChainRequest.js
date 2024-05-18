const mongoose = require('mongoose');

let ChainReqSchema = new mongoose.Schema ({
    requestingUserid: { type : String},
    requestedUserid: {type : String}
})

module.exports = mongoose.model('ChainRequest', ChainReqSchema, 'ChainRequests');