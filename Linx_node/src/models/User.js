const mongoose=require('mongoose');

let userSchema = new mongoose.Schema({
  userid : {
    type : String,
    required : [true]
  },
  accountid : {
    type : String,
    required : [true]
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
  } ,
  phone :{
    type : String,
    required : [false],
    maxLength : [9, '* Máx. número de caracteres 9'],
    minLength : [9, '*Min. número de caracteres 9']
  },
  gender : {
    type : String,
    required : [false]
  },
  birthday : {
    type : Date,
    required : [true, '* Necesaria la fecha de nacimiento']
  },
  location : {
    type : String,
    required : [false]
  } 
})

module.exports=mongoose.model('User',userSchema,'Users');