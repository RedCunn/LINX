const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt = require('jsonwebtoken');

let User = require('../schemas/User');
let Account = require('../schemas/Account');
let match = require('./utils/matching');

module.exports = {
    shuffleProfiles : async (req, res, next) => {
        try {
            const userid = req.params.userid;
            let _user = await User.findOne({'userid' : userid}) 

            // buscar en HalfMatches y en Matches

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
    },
    matchLinxs : async (req, res, next) => {
        //buscar en halfMatches if ifHalfMatched ---> do Match (sacar de HalfMatches) else do HaldMatch
        try {
            const userid = req.params.userid;
            const linxuserid = req.params.linxuserid;

            let matchGrade = 'half';

            res.status(200).send({
                code: 0,
                error: null,
                message: `Linxs ${matchGrade} MATCH...`,
                token: null,
                userData: null,
                others: null
            })
   
        } catch (error) {
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'no hemos podido completar el match ...',
                token: null,
                userData: null,
                others: null
            })
        }
    }
}
