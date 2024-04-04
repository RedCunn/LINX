const mongoose=require('mongoose');

let accountSchema = new mongoose.Schema ({
    userid : {type: String, 
        required : [true, '*Necesitas un user_id que asociar a esta cuenta'],
        unique : true
    },
    createdAt : {
        type: Date,
        required : [true],
        default : Date.now
    },  
    linxname : {
        type : String,
        required : [true, '* Nombre user requerido'],
        maxLength : [20, '* Máx. número de caracteres 20'],
        minLength : [3, '*Min. número de caracteres 3']
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
        required : true,
        default : false
    },
    myChain : [
        
        {
            accountid : {type : mongoose.Schema.Types.ObjectId, ref : 'Account'}
        }
    ]
})

module.exports=mongoose.model('Account',accountSchema,'Accounts');