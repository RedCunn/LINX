const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt = require('jsonwebtoken');

let User = require('../schemas/User');
let Account = require('../schemas/Account');

async function shuffleProfilesBasedOnUserPreferences(user) {
    try {

        let _activeAccounts = await retrieveFilteringWithActiveAccounts();

        //-----------LOCATION
        let _filteredByLocation = [];

        switch (user.userLocation.proxyRange) {
            case 'city':
                _filteredByLocation = await User.find({
                    '_id': { $in: _activeAccounts.map(doc => doc._id) },
                    'geolocation.city_id ': user.geolocation.city_id
                });
                break;
            case 'country':
                _filteredByLocation = await User.find({
                    '_id': { $in: _activeAccounts.map(doc => doc._id) },
                    'geolocation.country_id ': user.geolocation.country_id
                });
                break;
            case 'area1':
                _filteredByLocation = await User.find({
                    '_id': { $in: _activeAccounts.map(doc => doc._id) },
                    'geolocation.area1_id ': user.geolocation.area1_id
                });
                break;
            case 'area2':
                _filteredByLocation = await User.find({
                    '_id': { $in: _activeAccounts.map(doc => doc._id) },
                    'geolocation.area2_id ': user.geolocation.area2_id
                });
                break;
            case 'continent':
                _filteredByLocation = await User.find({
                    '_id': { $in: _activeAccounts.map(doc => doc._id) },
                    'geolocation.continent ': user.geolocation.global_code
                });
                break;
            case 'global':
                _filteredByLocation = _activeAccounts;
                break;

        }

        //--------------GENDER 
        const userGenderPrefs = user.preferences.genders;

        let _filteredByGender = await User.aggregate([
            {
                $match: {
                    '_id': { $in: _filteredByLocation.map(doc => doc._id) },
                    'gender': { $in: userGenderPrefs }
                }
            },
            {
                $lookup: {
                    from: "Filterings", 
                    localField: "_id",
                    foreignField: "userid",
                    as: "userFilterings"
                }
            },
            {
                $addFields: {
                    matchesPreferences: {
                        $gt: [{ $size: { $setIntersection: ["$userFilterings.preferences.genders", user.gender] } }, 0]
                    }
                }
            },
            {
                $match: {
                    matchesPreferences: true
                }
            }
        ]);

        console.log(_filteredByGender);

        //----------------AGE 
        // let fromAge = user.ageRange.fromAge
        // let toAge = user.ageRange.toAge

        // let fromDate = new Date();
        // fromDate.setFullYear(fromDate.getFullYear() - fromAge);
        // let fromDateToISO = fromDate.toISOString();
        // let toDate = new Date();
        // toDate.setFullYear(toDate.getFullYear() - toAge);
        // let toDateToISO = toDate.toISOString();

        // let _filteredByAge = await Filtering.find({
        //     '_id': { $in: _filteredByGender.map(doc => doc._id) },
        //     'birthday': { $gte: fromDateToISO, $lte: toDateToISO }
        // });
        // //-----------LANG

        // let _filteredByLang = await Filtering.findOne({
        //     '_id': { $in: _filteredByDiet.map(doc => doc._id) }, 
        //     'language.userLanguages' : { $in: user.language.langPreferences }
        // })
/*
const compatibilityPercentage = 0;
*/
        // //--------------BELIEFS (1/8 = 0,125)
        // let _filteredByBeliefs = [];

        // if(user.beliefs.shareBeliefs){

        //     if(user.beliefs.hasReligion){

        //         _filteredByBeliefs = await Filtering.find({
        //             '_id': { $in: _filteredByAge.map(doc => doc._id) }, 
        //             'beliefs.hasReligion': true,
        //             'beliefs.religion' : user.beliefs.religion 
        //         })

        //     }else{
        //         _filteredByBeliefs = await Filtering.find({
        //             '_id': { $in: _filteredByAge.map(doc => doc._id) }, 
        //             'beliefs.hasReligion': false 
        //         })
        //     }
        // }else{
        //     _filteredByBeliefs = _filteredByAge
        // }


        // //-------------POLITICS (4/8 = 0,5)
        // // autho-left || libe-left || autho-right || libe-right || some-left || some-right || center || none
        // let _filteredByPolitics = [];

        // if(user.politics.sharePolitcs !== 'false'){
        //     // true || false || lessright || lessleft || lessautho || lesslibe || lessnone || lesscenter
        //     switch(user.politics.sharePolitcs){
        //         case 'true':
        //             _filteredByPolitics = await Filtering.find({
        //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
        //                 'politics.userPoliticalSpec': user.politics.userPoliticalSpec 
        //             })
        //             break;
        //         case 'lessright':
        //             _filteredByPolitics = await Filtering.find({
        //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
        //                 'politics.userPoliticalSpec': { $not: /.*right.*/ }
        //             })
        //             break;
        //         case 'lessleft':
        //             _filteredByPolitics = await Filtering.find({
        //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
        //                 'politics.userPoliticalSpec': { $not: /.*left.*/ }
        //             })
        //             break;
        //         case 'lessautho':
        //             _filteredByPolitics = await Filtering.find({
        //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
        //                 'politics.userPoliticalSpec': { $not: /.*autho.*/ }
        //             })
        //             break;
        //         case 'lesslibe':
        //             _filteredByPolitics = await Filtering.find({
        //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
        //                 'politics.userPoliticalSpec': { $not: /.*libe.*/ }
        //             })
        //             break;
        //         case 'lessnone':
        //             _filteredByPolitics = await Filtering.find({
        //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
        //                 'politics.userPoliticalSpec': { $ne: 'none' }
        //             })
        //             break;
        //         case 'lesscenter':
        //             _filteredByPolitics = await Filtering.find({
        //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
        //                 'politics.userPoliticalSpec': { $ne: 'center' }
        //             })
        //             break;

        //     }

        // }else{
        //     _filteredByPolitics = _filteredByBeliefs
        // }

        // //-----------DIET (2/8 = 0,25)

        // let _filteredByDiet = []

        // if(user.diet.shareDiet){
        //     _filteredByDiet = await Filtering.find({
        //         '_id': { $in: _filteredByPolitics.map(doc => doc._id) }, 
        //         'diet.userDiet': user.diet.userDiet
        //     })
        // }else{
        //     _filteredByDiet = _filteredByPolitics
        // }

        // //--------------WORK (1/8 = 0,125)

        // let _filteredByWork = [];

        // if(user.work.shareIndustry !== 'false'){

        //     if(user.work.shareIndustry !== 'true'){

        //         if(user.work.userIndustry !== 'other'){
        //             _filteredByWork = await Filtering.findOne({
        //                 '_id': { $in: _filteredByLang.map(doc => doc._id) }, 
        //                 'work.userIndustry' : user.work.userIndustry
        //             })
        //         }else{
        //             _filteredByWork = await Filtering.findOne({
        //                 '_id': { $in: _filteredByLang.map(doc => doc._id) }, 
        //                 'work.other' : user.work.other
        //             })
        //         }

        //     }else{

        //         if(user.work.userIndustry !== 'other'){
        //             _filteredByWork = await Filtering.findOne({
        //                 '_id': { $in: _filteredByLang.map(doc => doc._id) }, 
        //                 'work.userIndustry' : {$ne : user.work.userIndustry}
        //             })
        //         }else{
        //             _filteredByWork = await Filtering.findOne({
        //                 '_id': { $in: _filteredByLang.map(doc => doc._id) }, 
        //                 'work.other' : {$ne : user.work.other}
        //             })
        //         }   
        //     }

        // }else{
        //     _filteredByWork = _filteredByLang
        // }

        /*
        if(compatibilityPercentage < 0,5){
            //no pasan el filtro
        }
        */
        return _filteredByGender;
    } catch (error) {
        console.log('ERROR SHUFFLING PROFILES : : ', error)
        return [];
    }
}

async function setProfilesForUser(shuffledProfs) {

    const candidateProfs = shuffledProfs;

    /*
        * birthday

        * userGender

        * userLocation

        * beliefs - hasReligion - religion

        * politics - userPoliticalSpec

        * diet - userDiet

        * language - userLanguages

        * work - userIndustry 
    */

    return candidateProfs;
}

async function retrieveFilteringWithActiveAccounts() {

    User.find({ accountid: { $ne: null } })
        .populate([
            { path: 'accountid', model: 'Account' },
            { path: 'userPreferences', model: 'Filtering' }
        ])
        .exec(function (err, users) {
            if (err) {
                console.log('ERROR RETRIEVING ACTIVE ACCOUNTS ', err)
                return [];
            } else {
                const activeUsers = users.filter(user => user.accountid.active);
                const activeUserPreferences = activeUsers.map(user => user.userPreferences);
                return activeUserPreferences;
            }
        });
}

module.exports = {
    signin: async (req, res, next) => {
        let { emailorlinxname, password } = req.body;
        try {

            let _account = await Account.findOne({ $or: [{ email: emailorlinxname }, { linxname: emailorlinxname }] })

            if (!_account) throw new Error('no existe cuenta con ese email o linxname...................');

            if (bcrypt.compareSync(password, _account.password)) {

                if (!_account.active) throw new Error('ESTA CUENTA NO ESTA ACTIVADA...................');

                let _userPrefs = await Filtering.findOne({ userid: _account.userid })

                let _userProf = await User.findOne({ userid: _account.userid });

                

                let userData = { _userProf, preferences: _userPrefs, account: _account }

                console.log('BACK USERDATA : ', userData)

                let _jwt = jwt.sign(
                    {
                        userid: _account.userid,
                        username: _account.username,
                        email: _account.email
                    },
                    process.env.JWT_SECRETKEY,
                    {
                        expiresIn: '1h',
                        issuer: 'http://localhost:3000'
                    }
                )

                res.status(200).send({
                    code: 0,
                    error: null,
                    message: `${_account.linxname} ha iniciado sesión`,
                    token: _jwt,
                    userdata: userData,
                    others: null
                })
            }

        } catch (error) {
            console.log("ERROR EN EL LOGIN .....", error)

            res.status(200).send({
                code: 1,
                error: error.message,
                message: `ERROR AL INICIAR SESION con ${emailorlinxname}`,
                token: null,
                userdata: null,
                others: null
            })
        }
    }

}
