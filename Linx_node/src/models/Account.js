const mongoose=require('mongoose');

let accountSchema = new mongoose.Schema ({
    userid : {
        type : String,
        required : [true]
    },
    accountid : {
        type : String,
        required : [true]
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
    }
})

module.exports=mongoose.model('Account',accountSchema,'Accounts');