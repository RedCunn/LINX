const mongoose = require('mongoose');

const FilteringSchema = new mongoose.Schema({
    userid : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    birthday : {
        type : Date,
        required : [true, '* Necesaria la fecha de nacimiento']
    },
    ageRange : {
        fromAge : {
            type : Number,
            required : [true],
            default : 18
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
    genders : [
        {
            gender : {type : String}
        }
    ],
    userLocation : {
        type : String,
        required : [true, '* Necesario habilitar location']
    },
    proxyRange : {type : String , required : [true], default : 'City'},
    beliefs : {
        hasReligion : {type : Boolean, default : false},
        isSpiritual : {type : Boolean, default : false},
        religion : {type : String , default : 'none'},
        shareBeliefs : {type : Boolean , default : false}
    },
    politics : {
        userPoliticalSpec : {type : String},
        // IDC || EXRIGHT || EXLEFT || EXAUTHORITARIAN || EXLIBERTARIAN || SAMESPEC 
        sharePolitics : {type : String, default : 'IDC' }
    },
    diet : {
        userDiet : {type : String},
        shareDiet : {type : Boolean, default : false}
    },
    language : {
        userLanguages : [
            {lang : {type : String, default : 'es'}}
        ],
        langPreferences : [
            {lang : {type : String, default : 'es'}}
        ]
    },
    work : {
        userIndustry : {type : String},
        // IDC || SAMEINDUSTRY || AVOIDSAME
        shareIndustry : {type : String , default : 'IDC'}
    }

})

module.exports = mongoose.model('Filtering', FilteringSchema, 'UserPreferences');