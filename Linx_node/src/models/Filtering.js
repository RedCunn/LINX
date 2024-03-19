const mongoose = require('mongoose');

const FilteringSchema = new mongoose.Schema({
    userid : {type: String, 
             required : [true, '*Necesitas un user_id que asociar a estas preferencias'],
             unique : true
            },
    birthday : {
        type : Date,
        required : [true, '* Necesaria fecha de nacimiento']
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
    userGender : {
        type : String,
        required : [true, '* Necesario userGender']
    },
    genders : [String],
    userLocation : {
        country_id : {type: String, required : true},
        city_id : {type: String, required : true},
        area1_id : {type: String, required : true},
        area2_id : {type: String, required : true},
        global_code : {type: String, required : true}
    },
    proxyRange : {type : String , required : [true], default : 'city'},
    beliefs : {
        hasReligion : {type : Boolean, default : false},
        religion : {type : String , default : ''},
        shareBeliefs : {type : Boolean , default : false}
    },
    politics : {
        // autho-left || libe-left || autho-right || libe-right || some-left || some-right || center || none
        userPoliticalSpec : {type : String},
        // true || false || lessright || lessleft || lessautho || lesslibe || lessnone || lesscenter
        sharePolitics : {type : String, default : 'false' }
    },
    diet : {
        userDiet : {type : String},
        shareDiet : {type : Boolean, default : false}
    },
    language : {
        userLanguages : [
            String
        ],
        langPreferences : [
            String
        ]
    },
    work : {
        userIndustry : {type : String},
        other : {type : String},
        // true || false || avoid
        shareIndustry : {type : String , default : 'false'}
    }

})

module.exports = mongoose.model('Filtering', FilteringSchema, 'Filterings');