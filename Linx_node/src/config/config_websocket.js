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
        socket.on('init_chat',(data) => {
            socket.join(data.roomkey);
        })
        socket.on('chat_message', (data) => {
            io.to(data.roomkey).emit('get_message',data.message)
        })
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    })
    
}

module.exports = ioFn;