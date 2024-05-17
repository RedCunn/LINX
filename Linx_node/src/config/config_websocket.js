const socketio = require('socket.io');

const ioFn = (httpServer) => {

    const io = new socketio.Server(httpServer, {
        cors: {
            origin : 'http://localhost:4200',
            methods: ['GET', 'POST'],
        }
    })

    io.on('connection', (socket) => {

        socket.on('userConnected',(data) => {
            socket.broadcast.emit('linx_connected', data.user.linxname);
        })
        socket.on('init_chat',(socketid) => {
            const room = 'chat_';
            console.log('linxsocketid ---> ', socketid)
            socket.join(room);
        })
        socket.on('chat_message', (data) => {
            const room = 'chat_';
            console.log('ROOM : ---> ', room)
            console.log('MESSAGE : ', data.message)
            io.to(room).emit('get_message',data.message)
        })
    })
    
}

module.exports = ioFn;