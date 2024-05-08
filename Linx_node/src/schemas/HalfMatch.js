const mongoose = require('mongoose');

let HalfMatchSchema = new mongoose.Schema ({
    matchingAccountid: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    matchedAccountid: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
})

module.exports = mongoose.model('HalfMatch', HalfMatchSchema, 'HalfMatches');

