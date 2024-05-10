const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    
    participants: {
        userid: {type : String},
        linxaccountid: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
    }
    ,
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