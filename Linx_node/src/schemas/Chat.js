const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    
    participants: {
        userid_a: {type : String, unique : false},
        userid_b: { type : String, unique : false}
    },
    roomkey : {type : String, unique : true},
    messages: [
        {
            text: { type: String, maxLength: 300, minLength: 1 },
            timestamp: { type: Date },
            sender: { 
                accountid : {type: String, unique : false},
                linxname : {type : String} 
            }
        }
    ]
})

module.exports = mongoose.model('Chat', chatSchema, 'Chats');