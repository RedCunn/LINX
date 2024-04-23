import { Component} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import{ChatComponent} from '../chat.component'

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [MatIcon, ChatComponent],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css'
})
export class ConversationsComponent {
  
  
  loadChat(){
    console.log('hola 👹')
  }
}
