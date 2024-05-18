import { Injectable, inject } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { SignalStorageService } from './signal-storage.service';
import { IMessage } from '../models/chat/IMessage';
import { BehaviorSubject, Observable } from 'rxjs';

const socket: Socket = io("http://localhost:3000")

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private signalStorageSvc = inject(SignalStorageService);
  private userConnected!: object | null;
  private _messagesSubject$ : BehaviorSubject<IMessage[]> = new BehaviorSubject<IMessage[]>([]);
  constructor() { }

  disconnect() {
    socket.disconnect();
    socket.removeAllListeners();
  }

  connect() {
    socket.connect()
    socket.on('connect', () => { 
      console.log('CONNECTED TO SOCKET ........................') 
    });
  }

  userLogin() {
    const _usersignal = this.signalStorageSvc.RetrieveUserData();
    const _user = _usersignal();
    this.userConnected = { accountid: _user?.account!._id, linxname: _user?.account!.linxname };
    socket.emit('userConnected', { user: this.userConnected })
  }

  linxConnected () {
    socket.on('linx_connected', (data) => {
      console.log('LINX INNN ', data)
    });
  }

  initChat (key : string){
    socket.emit("init_chat", {roomkey : key}, (res: any) => {
      console.log('RES OK : ', res.status)
    }
    )
  }

  sendMessage(message : IMessage, roomkey : string) {
    socket.emit("chat_message", { message, roomkey : roomkey }, (res: any) => {
      console.log('RES OK : ', res.status)
    }
    )
  }

  getMessages(){
      socket.on('get_message', (data) => {
        this._messagesSubject$.next(data);
      });
  }

  receiveMessages() : Observable<IMessage[]>{
    return this._messagesSubject$.asObservable();
  };


  linxmatch() {
    socket.on('match', () => {

    })
  }
  newEventOnChain() {
    socket.on('new_event', () => {

    })
  }
}
