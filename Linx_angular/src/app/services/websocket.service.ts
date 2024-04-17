import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';

const socket: Socket = io("http://localhost:3000", { autoConnect: false, port: 3000, timeout: 10000, withCredentials : true })

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }

  connect() {
    socket.connect()

    socket.emit("test","inicio",(res : any)=> { console.log('RES OK : ', res.status)})

    socket.io.on('ping', ()=> { console.log('PONG')})

    socket.on("connect_error", (err)=> {
      console.log('ERROR DE CONEEXIOM ', err)
    })
  }

  disconnect(){
    socket.disconnect();
  }

  sendMessage(){
      socket.emit("message","chat",(res : any)=> { 
        console.log('RES OK : ', res.status)
      }
    )
  }
  receiveMessage(){
    socket.on('inbox', ()=> {
      console.log('')
    })
  }
  linxmatch(){
    socket.on('match', ()=> {
      
    })
  }
  newEventOnChain(){
    socket.on('new_event', ()=> {
      
    })
  }
}
