const bcrypt = require('bcrypt');
const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const mailer = require('./utils/mailer')
const places = require('./utils/googleplaces');

const { default: mongoose } = require('mongoose');

const UserRepository = require('../data_access/userRepo');
const AccountRepository = require('../data_access/accountRepo');
const Account = require('../schemas/Account');


function generateToken(userdata){
    
    const payload = {
            userid : userdata.userid,
            email : userdata.email
    }
    const token = jwt.sign(payload, process.env.JWT_SECRETKEY,{expiresIn:'2h'})
    return token;
}

module.exports = {
    
    trackLocationGeocode : async (req, res, next) => {
        try {
            
            let {lat, long} = req.query;

            const userlocation = await places.geocode(lat, long);

            console.log('RELEVANT ADDRESS --------', userlocation.formatAddr);

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

        const UserRepo = new UserRepository();
        const AccountRepo = new AccountRepository();

        try {            

            const _user_id = uuidv4();

            const actToken = generateToken(); 
            let now = moment();
            let expires = now.add(2,'hours');

            let _account = {
                        userid : _user_id,
                        createdAt : account.createdAt,
                        linxname : account.linxname,
                        email : account.email,
                        password : bcrypt.hashSync(account.password,10),
                        active : false,
                        activeToken : actToken,
                        activeExpires : expires
                    }
            let _accountInsertResult = await AccountRepo.createAccount(_account, session);
            if(!_accountInsertResult) await session.abortTransaction();
            console.log("INSERT RESULT - ACCOUNT - : ", _accountInsertResult)
            
            const _findAccountID = await AccountRepo.findUserAccount(_user_id);

            let _user = {
                    userid : _user_id,
                    accountid : _findAccountID.id,
                    name : req.body.name,
                    lastname : req.body.lastname,
                    preferences : {
                        ageRange : {
                            fromAge : parseInt(preferences.ageRange.fromAge),
                            toAge : parseInt(preferences.ageRange.toAge)
                        },
                        genders : preferences.genders,
                        proxyRange: preferences.proxyRange,
                        sharePolitics : preferences.sharePolitics,
                        shareDiet : preferences.shareDiet,
                        languages : preferences.languages,
                        shareIndustry : preferences.shareIndustry
                    },
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
                        hasReligion : req.body.beliefs.hasReligion
                    },
                    politics : req.body.politics,
                    diet : req.body.diet,
                    languages : req.body.languages,
                    work : {
                        industry : req.body.work.industry,
                        other : req.body.work.other
                    },
                    myChain : []
            }
            let _userInsertResult = await UserRepo.createUser(_user, session);
            if(!_userInsertResult) await session.abortTransaction();
            console.log("INSERT RESULT - USER - : ", _userInsertResult);

            await session.commitTransaction();
            session.endSession();
            console.log("Todas las inserciones fueron exitosas.");

            mailer.sendAccountActivationEmail(_account.email, actToken);

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
            const token = req.params.token;
            const decoded = jwt.verify(token,process.env.JWT_SECRETKEY)

            if(moment().isAfter(decoded.exp)){
                res.status(400).send({
                    code: 1,
                    error: error.message,
                    message: 'EXPIRED TOKEN',
                    token: null,
                    userData: null,
                    others: null
                })
            }

            await Account.updateOne({userid:decoded.userid},{active:true});

            res.status(200).send({
                code: 0,
                error: null,
                message: 'CUENTA USER ACTIVA',
                token: null,
                userData: null,
                others: null
            })
        } catch (error) {
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'ERROR AL ACTIVAR CUENTA USER',
                token: null,
                userData: null,
                others: null
            })
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