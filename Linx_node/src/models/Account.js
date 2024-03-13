const mongoose=require('mongoose');

let accountSchema = new mongoose.Schema ({
    userid : {
        type : {type : mongoose.Schema.Types.ObjectId, ref : 'User'}
    },
    createdAt : {
        type: Date,
        required : [true],
        default : Date.now
    },
    email :{
        type : String,
        unique : true,
        required : [true, '* Email requerido'],
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'* el email no tiene un formato válido']
    },
    password : {
        type: String, 
        required:[true, '* Obligada contraseña'], 
        match:[/^(?=.*[0-9]).{8,}$/, '* la contraseña ha de tener mínimo 8 caracteres y un número']
    },
    active : {
        type : Boolean,
        required : [true],
        default : false
    },
    myCircle : [
        
        {
            userid : {type : mongoose.Schema.Types.ObjectId, ref : 'User'}
        }
    ]
})

module.exports=mongoose.model('Account',accountSchema,'Accounts');