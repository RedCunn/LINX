import { Component, ElementRef, Input, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-modaldraft',
  standalone: true,
  imports: [],
  templateUrl: './modaldraft.component.html',
  styleUrl: './modaldraft.component.scss'
})
export class ModaldraftComponent {
  @Input() isOpen = signal(false);
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  public cola : string[] = [];

  setMessage(event : any){
   this.cola.push(event.target.value);
   setTimeout(() => {
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
  });
  }


  
}
