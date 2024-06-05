const mongoose = require('mongoose');

let linxExtentSchema = new mongoose.Schema({
    chainadminID: {
        type: String,
        required: true
    },
    chainID : {
        type: String,
        required: true
    },
    mylinxuserID: {
        type: String,
        required: [true, '* Nombre user requerido'],
        maxLength: [20, '* Máx. número de caracteres 20'],
        minLength: [3, '*Min. número de caracteres 3']
    },
    userid: {
        type: String,
        required: true
    },
    onChainSince: {
        type: Date,
        required: [true],
        default: Date.now
    }
})

module.exports = mongoose.model('LinxExtent', linxExtentSchema, 'LinxExtents');