const socketio = require('socket.io');

const ioFn = (httpServer) => {

    const io = new socketio.Server(httpServer, {
        connectionStateRecovery: {
            // // the backup duration of the sessions and the packets
            // maxDisconnectionDuration: 2 * 60 * 1000,
            // // whether to skip middlewares upon successful recovery
            // skipMiddlewares: true
        },
        cors: {
            origin : '*',
            // origin: (_req, callback) => {
            //         callback(null, true);
            // },
            //credentials : true,
            methods: ['GET', 'POST'],
        }
    })

    io.on('connection', (socket) => {
        // the userId attribute will either come:
        // - from the middleware above (first connection or failed recovery)
        // - from the recevery mechanism
        console.log("se ha conectado une linx");
    })

    // io.engine.on("initial_headers", (headers, req) => {
    //     if (req.session) {
    //         headers["set-cookie"] = serialize("sid", req.session.id, { sameSite: "strict" });
    //     }
    // });

    
}

module.exports = ioFn;