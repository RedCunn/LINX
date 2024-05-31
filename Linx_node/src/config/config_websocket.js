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
            socket.broadcast.emit('linx_connected', data.linxname);
        })
        socket.on('init_user_room',(data) => {
            console.log('INIT USER ROOM ...', data.roomkey)
            socket.join(data.roomkey);
        })
        socket.on('init_chat',(data) => {
            console.log('CHAT INITIALIZED ........',data)
            socket.join(data.roomkey);
        })
        socket.on('chat_message', (data) => {
            console.log('config websocket chat_message : ', data)
            io.to(data.roomkey).emit('get_message',data.message)
        })
        socket.on('full_match', (data)=> {
            console.log('SOCKET ON FULL MATCH................. ', data)
            io.to(data.from_userid).emit('get_interaction',{type : 'match', interaction: data.to_user})
            io.to(data.to_userid).emit('get_interaction',{type : 'match', interaction: data.from_user})
        })
        socket.on('on_req_chain', (data)=> {
            console.log('on REQ CHAIN :',data)
            io.to(data.to_userid).emit('get_interaction',{type : 'reqchain', interaction: data.from_user})
        })
        socket.on('on_reject_req_chain', (data)=> {
            console.log('on REJECT REQ CHAIN :',data)
            io.to(data.to_userid).emit('get_interaction',{type : 'rejreqchain', interaction: data.from_user})
        })
        socket.on('on_chain', (data)=> {
            console.log('on CHAIN :',data)
            io.to(data.to_userid).emit('get_interaction',{type : 'chain', interaction: data.from_user})
        })
        socket.on("broken_chain", (data) => {
            io.to(data.to_userid).emit('get_interaction',{type : 'broken', interaction : data.from_user})
        })
        socket.on('new_event', (data)=> {
            //tengo que tener una roomkey para todos los de la misma cadena
            io.to(data.to_userid).emit('get_interaction',{type : 'event', interaction: data.event})
        })
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    })   
}

module.exports = ioFn;