const bcrypt = require('bcrypt');
const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

let User = require('../models/User');
let Account = require('../models/Account');
let Filtering = require('../models/Filtering');
const { default: mongoose } = require('mongoose');

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
            
            const cityResult = _res.data.results.find(result => result.types.includes('locality') || result.types.includes('administrative_area_level_3') ||
            result.types.includes('postal_code'));
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
        
        let {preferences, account, location} = req.body; 
        const session = await mongoose.startSession();
        session.startTransaction();

        try {            

            const _user_id = uuidv4();

            let _filteringInsertResult = await Filtering.create(
                [{
                    userid : _user_id,
                    ageRange : {
                        fromAge : parseInt(preferences.ageRange.fromAge),
                        toAge : parseInt(preferences.ageRange.toAge)
                    },
                    genders : preferences.genders,
                    proxyRange: preferences.proxyRange,
                    shareBeliefs :  preferences.shareBeliefs,
                    sharePolitics : preferences.sharePolitics,
                    shareDiet : preferences.shareDiet,
                    languages : preferences.languages,
                    shareIndustry : preferences.shareIndustry

                }],
                {session}
            );

            console.log("INSERT RESULT - FILTERING - : ", _filteringInsertResult)
            let _accountInsertResult = await Account.create(
                [{
                    userid : _user_id,
                    createdAt : account.createdAt,
                    linxname : account.linxname,
                    email : account.email,
                    password : bcrypt.hashSync(account.password,10),
                    active : false,
                    myCircle : []
                }],
                {session}
            );
            console.log("INSERT RESULT - ACCOUNT - : ", _accountInsertResult)
            
            const _findFilteringID = await Filtering.findOne({ userid: _user_id }, { projection: { _id: 1 } });
            const _findAccountID = await Account.findOne({ userid: _user_id }, { projection: { _id: 1 } });

            let _userInsertResult = await User.create(
                [{
                    userid : _user_id,
                    accountid : _findAccountID,
                    name : req.body.name,
                    lastname : req.body.lastname,
                    preferences : _findFilteringID,
                    birthday : req.body.birthday,
                    gender : req.body.gender,
                    geolocation : {
                        country_id : location.country_id,
                        city_id : location.city_id,
                        area1_id : location.area1_id,
                        area2_id : location.area2_id,
                        global_code : location.global_code
                    },
                    beliefs : {
                        hasReligion : req.body.beliefs.hasReligion,
                        religion : req.body.beliefs.religion
                    },
                    politics : req.body.politics,
                    diet : req.body.diet,
                    languages : req.body.languages,
                    work : {
                        industry : req.body.work.industry,
                        other : req.body.work.other
                    }
                }],
                {session}
            );

            console.log("INSERT RESULT - USER - : ", _userInsertResult);

            await session.commitTransaction();
            session.endSession();
            console.log("Todas las inserciones fueron exitosas.");

            res.status(200).send({
                code: 0,
                error: null,
                message: 'REGISTRO COMPLETADO',
                token: null,
                userData: null,
                others: null
            })
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error("Error durante la inserción:", error);
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