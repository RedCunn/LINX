import { Injectable, inject } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { SignalStorageService } from './signal-storage.service';
import { IUser } from '../models/userprofile/IUser';
import { IMessage } from '../models/chat/IMessage';
import { IAccount } from '../models/useraccount/IAccount';
import { Observable } from 'rxjs';

const socket: Socket = io("http://localhost:3000")

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private signalStorageSvc = inject(SignalStorageService);
  private userConnected!: object | null;

  constructor() { }

  disconnect() {
    socket.disconnect();
    socket.removeAllListeners();
  }

  connect() {
    socket.connect()
    socket.on('connect', () => { console.log('CONNECTED TO SOCKET ........................') });
  }

  userLogin() {
    const _usersignal = this.signalStorageSvc.RetrieveUserData();
    const _user = _usersignal();
    this.userConnected = { accountid: _user?.account!._id, linxname: _user?.account!.linxname };
    socket.emit('userConnected', { user: this.userConnected })
  }

  initChat (accountid_A : string, accountid_B : string){
    socket.emit("initChat", { accountid_A, accountid_B }, (res: any) => {
      console.log('RES OK : ', res.status)
    }
    )
  }

  sendMessage(message : IMessage, accountid_A : string, accountid_B : string) {
    socket.emit("chat_message", { message, accountid_A, accountid_B }, (res: any) => {
      console.log('RES OK : ', res.status)
    }
    )
  }
  getMessages() {
    let obs = new Observable<IMessage>(observer => {
      socket.on('chat_message', (data) => {
        observer.next(data.message);
      });

      return () => {socket.disconnect()}
    })

    return obs;
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
