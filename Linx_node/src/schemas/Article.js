
const mongoose = require('mongoose');

let ArticleSchema = new mongoose.Schema ({
    userid : {type : String, required : true},
    postedOn : {type : Date, default: Date.now},
    title : {type : String, maxLength : 50},
    body : {type : String, maxLength : 300},
    img : {data : Buffer, contentType: B},
    useAsProfilePic : {type : Boolean, default : false}
})

module.exports = mongoose.model('Article', ArticleSchema, 'Articles');


