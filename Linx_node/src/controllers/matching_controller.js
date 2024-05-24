
const { v4: uuidv4 } = require('uuid');
let User = require('../schemas/User');
let match = require('./utils/matching');
const matching = require('./utils/matching');
const Match = require('../schemas/Match');
const Account = require('../schemas/Account');

module.exports = {
    shuffleProfiles: async (req, res, next) => {
        try {
            const userid = req.params.userid;
            let _user = await User.findOne({ 'userid': userid })

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
    matchLinxs: async (req, res, next) => {
        try {
            const userid = req.params.userid;
            const linxuserid = req.params.linxuserid;

            let matchRank = 'HALF';

            let _areHalfMatches = await matching.areHalfMatches(userid, linxuserid);

            if (_areHalfMatches.length > 0) {
                const currentDate = new Date().toISOString();
                const _roomkey = uuidv4();
                let _doMatch = await matching.doMatch(userid, linxuserid, currentDate, _roomkey);
                console.log('RESULT DOING MATCH -> ', _doMatch);
                let _removeHalfMatch = await matching.removeFromHalfMatches(userid, linxuserid);
                console.log('RESULT REMOVING FROM HALFMATCH -> ', _removeHalfMatch);
                matchRank = 'FULL';
            } else {
                let _doHalfMatch = await matching.doHalfMatch(userid, linxuserid);
                console.log('RESULT DOING HALF MATCH ->', _doHalfMatch)
            }

            res.status(200).send({
                code: 0,
                error: null,
                message: `${matchRank}`,
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
    },
    getMatches: async (req, res, next) => {
        try {

            const userid = req.params.userid;

            let _matches = await Match.find({
                $or : [
                 {userid_a : userid},
                 {userid_b : userid}   
                ]
            })

            let matchUserIds = new Set();
            _matches.forEach(m => {
                if (m.userid_a !== userid) {
                    matchUserIds.add(m.userid_a);
                }
                if (m.userid_b !== userid) {
                    matchUserIds.add(m.userid_b);
                }
            })

            let accounts = await Account.find({
                userid : {$in : Array.from(matchUserIds)}
            })

            res.status(200).send({
                code: 0,
                error: null,
                message: 'MATCH ACCOUNTS WERE RETRIEVED : ',
                token: null,
                userdata: _matches,
                others: accounts
            })
        } catch (error) {
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'ERROR RETRIEVING MATCH ACCOUNTS',
                token: null,
                userdata: null,
                others: null
            })
        }
    }
}
