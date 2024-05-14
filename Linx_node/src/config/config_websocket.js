const socketio = require('socket.io');

const ioFn = (httpServer) => {

    const io = new socketio.Server(httpServer, {
        cors: {
            origin : '*',
            methods: ['GET', 'POST'],
        }
    })

    io.on('connection', (socket) => {

        socket.on('userConnected',(data) => {
            console.log('CONNECTED : ', data)
            io.emit('userConnected', data);
        })
        socket.on('init_chat',(socketid) => {
            const room = 'chat_'+socket.id+"_"+socketid;
            console.log('linxsocketid ---> ', socketid)
            socket.join(room);
        })
        socket.on('chat_message', (data) => {
            const room = 'chat_'+socket.id+"_"+data.socketid;
            console.log('chat_message - linxsocketid ---> ', data.socketid)
            console.log('MESSAGE : ', data.message)
            io.to(room).emit('chat_message',data.message)
        })
    })
    
}

module.exports = ioFn;