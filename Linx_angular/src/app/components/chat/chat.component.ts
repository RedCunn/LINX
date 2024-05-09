import { Component, inject } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { IChat } from '../../models/chat/IChat';
import { IMessage } from '../../models/chat/IMessage';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  private socketSvc = inject(WebsocketService);
  public chat : IChat = {participants : [], messages : []};
  public message! : IMessage;

  

}
