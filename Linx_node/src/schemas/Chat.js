const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    
    participants: {
        userid_a: {type : String},
        userid_b: { type : String}
    },
    roomkey : {type : String, unique : true},
    messages: [
        {
            text: { type: String, maxLength: 300, minLength: 1 },
            timestamp: { type: Date },
            sender: { 
                accountid : {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
                linxname : {type : String} 
            }
        }
    ]
})

module.exports = mongoose.model('Chat', chatSchema, 'Chats');