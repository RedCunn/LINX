const mongoose = require('mongoose');

let MatchSchema = new mongoose.Schema ({
    matchedAt : {  type: Date,required: [true],default: Date.now},
    accountid_1: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    accountid_2: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
})

module.exports = mongoose.model('Match', MatchSchema, 'Matches');

