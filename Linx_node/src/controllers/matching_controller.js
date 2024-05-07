const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt = require('jsonwebtoken');

let User = require('../schemas/User');
let Account = require('../schemas/Account');
let match = require('./utils/matching');

module.exports = {
    shuffleProfiles : async (req, res, next) => {
        try {
            let {userid} = req.body
            let _user = await User.findOne({'userid' : userid}) 
            let matchingProfiles = await match.retrieveProfilesBasedOnCompatibility(_user);

            res.status(200).send({
                code: 0,
                error: null,
                message: 'PERFILES COMPATIBLES ...',
                token: null,
                userData: null,
                others: matchingProfiles
            })

        } catch (error) {
        
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'no hemos encontrado PERFILES COMPATIBLES ...',
                token: null,
                userData: null,
                others: null
            })

        }   
    }
}
