const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: [true, '*Necesitas un user_id'],
    unique: true
  },
  accountid: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  name: {
    type: String,
    required: [true, '* Nombre propio del user requerido'],
    maxLength: [30, '* Máx. número de caracteres 30'],
    minLength: [2, '*Min. número de caracteres 2']
  },
  lastname: {
    type: String,
    required: [true, '* Apellido del user requerido'],
    maxLength: [30, '* Máx. número de caracteres 30'],
    minLength: [2, '*Min. número de caracteres 2']
  },
  birthday: {
    type: Date,
    required: [true, '* Necesaria fecha de nacimiento']
  },
  gender: {
    type: String,
    required: [true, '* Necesario userGender']
  },
  geolocation: {
    country_id: { type: String, required: true },
    city_id: { type: String, required: true },
    area1_id: { type: String, required: true },
    area2_id: { type: String, required: true },
    global_code: { type: String, required: true }
  },
  beliefs: {
    hasReligion: { type: Boolean, default: false },
    religion: { type: String, default: '' }
  },
  // autho-left || libe-left || autho-right || libe-right || some-left || some-right || center || none
  politics: { type: String },
  diet: { type: String },
  languages: [String],
  work: {
    industry: { type: String },
    other: { type: String }
  },
  preferences: {

    ageRange: {
      fromAge: {
        type: Number,
        required: [true],
        default: 16
      },
      toAge: {
        type: Number,
        required: [true],
        default: 120
      }
    },
    genders: [String],
    proxyRange: { type: String, required: [true], default: 'city' },
    sharePolitics: { type: String, default: 'false' },
    shareDiet: { type: Boolean, default: false },
    languages: [String],
    // true || false || avoid
    shareIndustry: { type: String, default: 'false' }

  },
  exchanger: [{ exitemid: { type: mongoose.Schema.Types.ObjectId, ref: 'Exitem' } }],
  agenda: [{ eventid: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' } }],
  myChain: [
    {
      accountid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  ]
})

module.exports = mongoose.model('User', userSchema, 'Users');