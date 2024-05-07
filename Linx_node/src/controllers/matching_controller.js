const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt = require('jsonwebtoken');

let User = require('../schemas/User');
let Account = require('../schemas/Account');
let match = require('./utils/matchfunction');

module.exports = {
    signin: async (req, res, next) => {
        let { emailorlinxname, password } = req.body;
        try {

            let _account = await Account.findOne({ $or: [{ email: emailorlinxname }, { linxname: emailorlinxname }] })

            if (!_account) throw new Error('no existe cuenta con ese email o linxname...................');

            if (bcrypt.compareSync(password, _account.password)) {

                if (!_account.active) throw new Error('ESTA CUENTA NO ESTA ACTIVADA...................');

                let _userProf = await User.findOne({ userid: _account.userid });                

                let userData = { _userProf, account: _account }

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
