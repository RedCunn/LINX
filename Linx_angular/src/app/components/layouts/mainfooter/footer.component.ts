import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ConversationsComponent } from '../../chat/conversations/conversations.component';
import { InteractionsComponent } from '../../interactions/interactions.component';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { initFlowbite, initTooltips } from 'flowbite';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIcon, ConversationsComponent, InteractionsComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements AfterViewInit, OnInit{

  public isChatsOpen = signal(false);
  public isInteractionsOpen = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router : Router){}

  toggleChatsModal() {
    this.isChatsOpen.update(v => !v)  
    this.isInteractionsOpen.set(false);
  }
  toggleInteractionsModal() {
    this.isInteractionsOpen.update(v => !v)
    this.isChatsOpen.set(false);
  }

  goLinxme(){
    this.router.navigateByUrl('/Linx/linxme');    
  }

  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  
  }
  ngAfterViewInit(): void {
    initTooltips();
  }

}
