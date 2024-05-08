const bcrypt = require('bcrypt');
const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const mailer = require('./utils/mailer')
const places = require('./utils/googleplaces');

const { default: mongoose } = require('mongoose');
const Account = require('../schemas/Account');
const User = require('../schemas/User');

function generateToken(userdata){
    
    const payload = {
            userid : userdata.userid,
            email : userdata.email,
            exp: moment().add(2, 'hours').unix()
    }
    const token = jwt.sign(payload, process.env.JWT_SECRETKEY)
    return token;
}

module.exports = {
    
    trackLocationGeocode : async (req, res, next) => {
        try {
            
            let {lat, long} = req.query;

            const userlocation = await places.geocode(lat, long);

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
        
        let {account, location} = req.body; 
        const session = await mongoose.startSession();
        session.startTransaction();

        try {            

            const _user_id = uuidv4();

            const actToken = generateToken({userid : _user_id, email : account.email}); 
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
                        activeExpires : expires,
                        myChain : [],
                        exchanger : [],
                        agenda : []
                    }
        
            console.log('TOKEN EXPIRES .........', expires);

            let _accountInsertResult = await Account.create([_account], session);
                    
            const _findAccountID = Account.findOne({ userid: _user_id });

            let _user = {
                    userid : _user_id,
                    accountid : _findAccountID.id,
                    name : req.body.name,
                    lastname : req.body.lastname,
                    preferences : {
                        ageRange : {
                            fromAge : parseInt(req.body.preferences.ageRange.fromAge),
                            toAge : parseInt(req.body.preferences.ageRange.toAge)
                        },
                        genders : req.body.preferences.genders,
                        proxyRange: req.body.preferences.proxyRange,
                        sharePolitics : req.body.preferences.sharePolitics,
                        shareDiet : req.body.preferences.shareDiet,
                        languages : req.body.preferences.languages,
                        shareIndustry : req.body.preferences.shareIndustry
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
                    politics : req.body.politics,
                    diet : req.body.diet,
                    languages : req.body.languages,
                    work : {
                        industry : req.body.work.industry,
                        other : req.body.work.other
                    }
            }
            let _userInsertResult = await User.create([_user], session);
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
            const token = req.query.token;
            const decoded = jwt.verify(token,process.env.JWT_SECRETKEY)
            
            console.log('DECODE : ', decoded)

            if(moment().unix() > decoded.exp){
                throw Error('Expired TOken')
            }
            await Account.updateOne({userid:decoded.userid},{active:true});
            res.redirect('http://localhost:4200/Linx/Activa')
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
    signin: async (req, res, next) => {
        let { emailorlinxname, password } = req.body;
        try {

            let _account = await Account.findOne({ $or: [{ email: emailorlinxname }, { linxname: emailorlinxname }] })

            if (!_account) throw new Error('no existe cuenta con ese email o linxname...................');

            if (bcrypt.compareSync(password, _account.password)) {

                if (!_account.active) throw new Error('ESTA CUENTA NO ESTA ACTIVADA...................');

                let _userProfQuery = await User.findOne({ userid: _account.userid });                
                let _userProf = _userProfQuery.toObject();
                let userData = { ..._userProf, accountid : _account._id, account: _account };

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