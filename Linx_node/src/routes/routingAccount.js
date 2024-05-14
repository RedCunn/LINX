const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/account_controller');

const jwt = require('jsonwebtoken');

async function checkJWT(req, res, next) {
    try {
        //extraigo de la peticion, la cabecera "Authorization: Bearer ....jwt..."
        let _jwt = req.headers.authorization.split(' ')[1];
        const _payload = await jwt.verify(_jwt, process.env.JWT_SECRETKEY);
        req.payload = _payload;
        next();

    } catch (error) {
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
router.post('/signin', AccountController.signin);
router.post('/deleteAccount',checkJWT, AccountController.deleteAccount);
router.post('/modifyAccount', checkJWT, AccountController.modifyAccountData);
router.post('/resetPwd', checkJWT, AccountController.resetPassword);
router.get('/activate_account', AccountController.activateAccount);
router.get('/:userid/myChain', checkJWT, AccountController.getMyChain);
router.get('/:userid/chat', checkJWT, AccountController.getChats);
router.post('/:userid/chat/:chatid', checkJWT, AccountController.storeChatMessage);
router.post('/:userid/article', AccountController.newArticle);
router.put('/:userid/article/:artid', AccountController.editArticle)

module.exports = router;