const socketio = require('socket.io');

const ioFn = (httpServer) => {

    const io = new socketio.Server(httpServer, {
        cors: {
            origin : '*',
            methods: ['GET', 'POST'],
        }
    })

    io.on('connection', (socket) => {
        console.log("se ha conectado une linx");

        socket.on('userConnected',(data) => {
            console.log('CONNECTED : ', data)
            io.emit('userConnected', data);
        })

        socket.on('chat_message', (data) => {
            console.log(data)
            io.emit('chat_message',data)
        })
    })
    
}

module.exports = ioFn;