require('dotenv').config();
const express = require('express');


const configServer = require('./config/config_pipeline');
const websocket = require('./config/config_websocket');
let app = express();
let server = app.listen(3000,()=> console.log('escuchando en el puerto 3000 🏠'));

configServer(app);
websocket(server);

const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTION_MONGODB)
        .then(
            () => console.log('______________MONGO CONNECTION STABLISHED')
        ).catch(
            (err) => console.log('MONGO CONNECTION FAILED_____________', err)
        )

