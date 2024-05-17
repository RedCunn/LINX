const Account = require('../schemas/Account');

module.exports = {
    getMyChain: async (req, res, next) => {
        try {
            const _userid = req.params.userid;

            let _userAccount = await Account.findOne({ userid:_userid });
              
            const _myChainPromises = _userAccount.myChain.map(async (linx, i) => {
                const account = await Account.find({ userid: linx.userid });
                return account;
            })
            const accounts = await Promise.all(_myChainPromises);
            
            res.status(200).send({
                code: 0,
                error: null,
                message: 'Cadena recuperada',
                token: null,
                userdata: null,
                others: accounts.flat()
            })
        } catch (error) {
            res.status(200).send({
                code: 1,
                error: error.message,
                message: 'Error al recuperar cadena...',
                token: null,
                userdata: null,
                others: null
            })
        }
    },
    chainLinxs : async (req, res, next) => {
        try {

            // añadir linx a myChain (sacar de Matches y poner en myChain) y añadir su chain a mi extendedChain (generar roomkeys)

            const userid = req.params.userid;
            const linxuserid = req.params.linxuserid;

            res.status(200).send({
                code: 0,
                error: null,
                message: 'NEW LINX TO CHAIN !!!',
                token: null,
                userData: null,
                others: null
            })

        } catch (error) {
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'error al hacer cadena ...',
                token: null,
                userData: null,
                others: null
            })
        }
    }
}