const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/account_controller');

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userid = req.params.userid; 
        const artid = req.body.articleid;
        const userDirectory = path.join('C:/Users/cunns/Documents/TFGLinx/articles', userid);

        fs.access(userDirectory, (err) => {
            if (err) {
                // El directorio no existe, intenta crearlo
                fs.mkdir(userDirectory, { recursive: true }, (err) => {
                    if (err) {
                        console.error('Error al crear el directorio:', err);
                        cb(err);
                    } else {
                        cb(null, userDirectory);
                    }
                });
            } else {
                // El directorio ya existe, establece la ruta de destino
                cb(null, userDirectory);
            }
    })
    },
    filename: function (req, file, cb) {
        cb(null, artid + '__' + file.originalname)
    }
})

const upload = multer({
    storage: storage
})

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
                    error: error.message,
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
router.post('/deleteAccount', checkJWT, AccountController.deleteAccount);
router.post('/modifyAccount', checkJWT, AccountController.modifyAccountData);
router.post('/resetPwd', checkJWT, AccountController.resetPassword);
router.get('/activate_account', AccountController.activateAccount);
router.put('/chat/:roomkey', AccountController.storeChatMessage);
router.post('/:userid/article', upload.single('file'), AccountController.newArticle);
router.put('/:userid/article/:artid', AccountController.editArticle)
router.get('/:userid/chat/:roomkey', AccountController.getChats)
module.exports = router;