import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-interactions',
  standalone: true,
  imports: [],
  templateUrl: './interactions.component.html',
  styleUrl: './interactions.component.css'
})
export class InteractionsComponent {

  @Input() isOpen = signal(false)

  closeModal(){
    this.isOpen.set(false);
  }
}
