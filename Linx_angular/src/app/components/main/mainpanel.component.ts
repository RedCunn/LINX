import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, inject, signal} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SignalStorageService } from '../../services/signal-storage.service';
import './mainpanel.component.scss';
import {LinxscarouselComponent} from '../meetingzone/linxscarousel.component';
import { isPlatformBrowser } from '@angular/common';
import { initFlowbite, initTooltips } from 'flowbite';

@Component({
  selector: 'app-mainpanel',
  standalone: true,
  imports: [FormsModule, LinxscarouselComponent],
  templateUrl: './mainpanel.component.html',
  styleUrl: './mainpanel.component.scss'
})
export class MainpanelComponent implements AfterViewInit, OnInit{
  public showMeetingZone = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  
  }
  ngAfterViewInit(): void {
    initTooltips();
  }


}
