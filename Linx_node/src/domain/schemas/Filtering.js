const mongoose = require('mongoose');

const FilteringSchema = new mongoose.Schema({
    userid : {type: String, 
             required : [true, '*Necesitas un user_id que asociar a estas preferencias'],
             unique : true
            },
    ageRange : {
        fromAge : {
            type : Number,
            required : [true],
            default : 16
        },
        toAge : {
            type : Number,
            required : [true],
            default : 120
        }
    },
    genders : [String],
    proxyRange : {type : String , required : [true], default : 'city'},
    shareBeliefs : {type : Boolean , default : false},
    sharePolitics : {type : String, default : 'false' },
    shareDiet : {type : Boolean, default : false},
    languages : [String],
    // true || false || avoid
    shareIndustry : {type : String , default : 'false'}
    

})

module.exports = mongoose.model('Filtering', FilteringSchema, 'Filterings');