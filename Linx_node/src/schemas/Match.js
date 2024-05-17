const mongoose = require('mongoose');

let MatchSchema = new mongoose.Schema ({
    matchedAt : {  type: Date,required: [true],default: Date.now},
    accountid_A: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    accountid_B: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
<<<<<<< HEAD
    roomkey : {type : String}
=======
    roomkey : {type: String}
>>>>>>> origin/trunk
})

module.exports = mongoose.model('Match', MatchSchema, 'Matches');

