const mongoose=require('mongoose');

let userSchema = new mongoose.Schema({
  userid : {type: String, 
    required : [true, '*Necesitas un user_id'],
    unique : true
   },
  accountid : {type : mongoose.Schema.Types.ObjectId, ref : 'Account'},
  name : {
    type : String,
    required : [true, '* Nombre propio del user requerido'],
    maxLength : [30, '* Máx. número de caracteres 30'],
    minLength : [2, '*Min. número de caracteres 2']
  },
  lastname : {
    type : String,
    required : [true, '* Apellido del user requerido'],
    maxLength : [30, '* Máx. número de caracteres 30'],
    minLength : [2, '*Min. número de caracteres 2']
  }, 
  userPreferences : { type : mongoose.Schema.Types.ObjectId, ref : 'Filtering'} 
})

module.exports=mongoose.model('User',userSchema,'Users');