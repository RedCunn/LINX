const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants : [{user : {type : mongoose.Schema.Types.ObjectId, ref : 'User'}}],
    messages : [
                    {text : {type : String , maxLength : 300, minLength : 1}, 
                    timestamp : {type : Date}, 
                    sender : {type : mongoose.Schema.Types.ObjectId, ref : 'User'}}
                ]
})

module.exports=mongoose.model('Chat',chatSchema,'Chats');