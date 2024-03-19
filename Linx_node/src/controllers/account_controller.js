const bcrypt = require('bcrypt');
const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

let User = require('../models/User');
let Account = require('../models/Account');
let Filtering = require('../models/Filtering');

module.exports = {
    trackLocationGeocode : async (req, res, next) => {
        try {
            
            let {lat, long} = req.query;

            const _res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.GOOGLE_MAPS_APIKEY}`)

            //PLACE DETAILS :
            //  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${campos}&key=${apiKey}`;

            console.log("GOOGLE RESPONSE : ", _res.data);

            
            const countryResult = _res.data.results.find(result => result.types.includes('country'));
            console.log("PAIS : ", countryResult)
            
            const cityResult = _res.data.results.find(result => result.types.includes('locality'));
            console.log("CIUDAD : ", cityResult)
            
            const communityResult = _res.data.results.find(result => result.types.includes('administrative_area_level_1'));
            console.log("COMUNIDAD: ", communityResult)
            
            const provinceResult = _res.data.results.find(result => result.types.includes('administrative_area_level_2'));
            console.log('PROVINCIA: ', provinceResult)

            const continentResult = _res.data.plus_code.global_code;
            console.log('CONTINENTE : ', continentResult)

            const relevantAddress = cityResult.formatted_address;

            const userlocation = {fullLoc : {
                country_id : countryResult.place_id,
                city_id : cityResult.place_id,
                area1_id : communityResult.place_id,
                area2_id : provinceResult.place_id,
                global_code : continentResult
            }, formatAddr : relevantAddress};

            console.log('RELEVANT ADDRESS --------', relevantAddress);

            res.status(200).send({
                code: 0,
                error: null,
                message: 'Trackeada localizacion actual del user por GoogleMaps Geocode',
                token: null,
                userData: null,
                others: userlocation
            })

        } catch (error) {
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'error al trackear localizacion actual por GoogleMaps Geocode',
                token: null,
                userData: null,
                others: null
            })
        }
    },
    signup : async (req, res, next)=>{
        
        let {filters, account} = req.body; 
        try {
            
            const _user_id = uuidv4();

            let _filteringInsertResult = await Filtering({
                userid : _user_id,
                birthday: filters.birthday,
                ageRange : {
                    fromAge : parseInt(filters.ageRange.fromAge),
                    toAge : parseInt(filters.ageRange.toAge)
                },
                userGender : filters.myGender,
                genders : filters.genders,
                userLocation : filters.location,
                proxyRange: filters.proxyRange,
                beliefs : {
                    hasReligion : filters.beliefs.hasReligion,
                    religion:  filters.beliefs.myreligion,
                    shareBeliefs :  filters.beliefs.shareBeliefs
                },
                politics : {
                    userPoliticalSpec : filters.politics.politicalSpectrum,
                    sharePolitics : filters.politics.sharePolitics
                },
                diet : {
                    userDiet : filters.diet.mydiet,
                    shareDiet : filters.diet.shareDiet
                },
                language : {
                    userLanguages : filters.language.mylanguages,
                    langPreferences : filters.language.theirlanguages
                },
                work : {
                    userIndustry : filters.work.myIndustry,
                    otherIndustry : filters.work.other,
                    shareIndustry : filters.work.shareIndustry
                }

            }).save();
            console.log("INSERT RESULT - FILTERING - : ", _filteringInsertResult)
            let _accountInsertResult = await Account({
                userid : _user_id,
                createdAt : account.createdAt,
                username : account.username,
                email : account.email,
                password : bcrypt.hashSync(account.password,10),
                active : false,
                myCircle : []
            }).save();
            console.log("INSERT RESULT - ACCOUNT - : ", _accountInsertResult)
            
            const _findFilteringID = await Filtering.findOne({ userid: _user_id }, { projection: { _id: 1 } });
            const _findAccountID = await Account.findOne({ userid: _user_id }, { projection: { _id: 1 } });

            let _userInsertResult = await User({
                userid : _user_id,
                accountid : _findAccountID,
                name : req.body.name,
                lastname : req.body.lastname,
                userPreferences : _findFilteringID
            }).save();

            console.log("INSERT RESULT - USER - : ", _userInsertResult);

            res.status(200).send({
                code: 0,
                error: null,
                message: 'REGISTRO COMPLETADO',
                token: null,
                userData: null,
                others: null
            })
        } catch (error) {
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'ERROR EN REGISTRO',
                token: null,
                userData: null,
                others: null
            })
        }
    },
    activateAccount : async (req, res, next)=>{
        try {

        } catch (error) {
            
        }
    },
    resetPassword : async (req, res, next)=>{
        try {

        } catch (error) {
            
        }
    },
    modifyAccountData : async (req, res, next)=>{
        try {

        } catch (error) {
            
        }
    },
    deleteAccount : async (req, res, next)=>{
        try {

        } catch (error) {
            
        }
    }

}