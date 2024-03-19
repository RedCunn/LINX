const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/account_controller');

const jwt = require('jsonwebtoken');

async function checkJWT(req, res, next) {
    try {
        //extraigo de la peticion, la cabecera "Authorization: Bearer ....jwt..."
        let _jwt = req.headers.authorization.split(' ')[1];
        console.log('JWT en cabecera mandado por cliente...', _jwt);

        const _payload = await jsonwebtoken.verify(_jwt, process.env.JWT_SECRETKEY);
        req.payload = _payload;
        next();

    } catch (error) {
        console.log('error al comprobar JWT enviado desde el cliente...', error);
        res.status(401)
            .send(
                {
                    code: 1,
                    message: 'error al comprobar JWT enviado',
                    error : error.message,
                    token: null,
                    userdata: null,
                    others: null 
                }
            );
    }
}

router.get('/trackLocationGeocode', AccountController.trackLocationGeocode);
router.post('/signup', AccountController.signup);
router.post('/deleteAccount',checkJWT, AccountController.deleteAccount);
router.post('/modifyAccount', checkJWT, AccountController.modifyAccountData);
router.post('/resetPwd', checkJWT, AccountController.resetPassword);

module.exports = router;