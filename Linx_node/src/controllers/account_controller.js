const bcrypt = require('bcrypt');
const multer = require('multer');

module.exports = {
    signup : async (req, res, next)=>{
        try {
            
        } catch (error) {
            
        }
    },
    signin : async (req, res, next)=>{
        try {

            let { email, password } = req.body;

            let _account = await Cliente.findOne({ 'account.email': email })
                .populate(
                    [
                        { path: 'direcciones', model: 'Direccion' },
                        { path: 'pedidos', model: 'Pedido', populate: [{ path: 'elementosPedido.libroElemento', model: 'Libro' }] }
                    ]
                );

            console.log(_cliente);

            if (!_cliente) throw new Error('no existe cuenta con ese email...');

            if (bcrypt.compareSync(password, _cliente.cuenta.password)) {
                if (!_cliente.cuenta.cuentaActiva) throw new Error('debes activar tu cuenta mediante el email de activación...')

                let _jwt = jsonwebtoken.sign(
                    {
                        nombre: _cliente.nombre,
                        apellidos: _cliente.apellidos,
                        email: _cliente.cuenta.email,
                        idCliente: _cliente.id
                    },
                    process.env.JWT_SECRETKEY,
                    {
                        expiresIn: '1h',
                        issuer: 'http://localhost:3003'
                    }
                );

                res.status(200).send({
                    codigo: 0,
                    mensaje: 'login OK',
                    error: '',
                    datoscliente: _cliente,
                    tokensession: _jwt,
                    otrosdatos: null,
                    redirectTo: '/Tienda/Librosv2'
                });


            } else {
                throw new Error('password incorrecta....');
            }

        } catch (error) {
            console.log('error en el login...', error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Login fallido',
                error: error.message,
                datoscliente: null,
                tokensession: null,
                otrosdatos: null
            });
        }
    }
}