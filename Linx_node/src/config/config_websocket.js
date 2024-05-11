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

        socket.on('init_chat',(accountid_A , accountid_B) => {
            const room = 'chat_'+accountid_A+"_"+accountid_B;
            socket.join(room);
        })

        socket.on('chat_message', (message, accountid_A , accountid_B) => {
            const room = 'chat_'+accountid_A+"_"+accountid_B;
            io.emit('chat_message',message)
        })
    })
    
}

module.exports = ioFn;