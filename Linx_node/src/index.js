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


// const axios = require('axios');
// const readline = require('readline');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });
  
//   rl.question('Introduce el término de búsqueda: ', async (answer) => {
//     // Procesa la respuesta del usuario
//     let _qstring = answer.trim(); // Elimina espacios en blanco al principio y al final
//     let _query = _qstring.replace(' ','+');
    
//     // Realiza la llamada a la API
//     try {
//       const response = await axios.get(`https://openlibrary-org.translate.goog/search.json?q=${_query}&_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=sc.json`);
//       console.log(response.data); // Imprime la respuesta de la API
//       //PORTADA: https://covers.openlibrary.org/b/id/${cover_i}-L.jpg
//     } catch (error) {
//       console.error('Error al realizar la llamada a la API:', error);
//     }
//     OL1407649M
//     rl.close(); // Cierra la interfaz readline
//   });