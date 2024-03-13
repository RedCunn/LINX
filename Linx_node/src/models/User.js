const mongoose=require('mongoose');

let userSchema = new mongoose.Schema({
  accountid : {
    type : {type : mongoose.Schema.Types.ObjectId, ref : 'Account'}
  },
  username : {
    type : String,
    required : [true, '* Nombre user requerido'],
    maxLength : [20, '* Máx. número de caracteres 20'],
    minLength : [3, '*Min. número de caracteres 3']
  },
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