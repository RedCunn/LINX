import { Component, OnInit, inject, signal} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SignalStorageService } from '../../services/signal-storage.service';
import './mainpanel.component.css';
import {LinxscarouselComponent} from '../meetingzone/linxscarousel.component';

@Component({
  selector: 'app-mainpanel',
  standalone: true,
  imports: [FormsModule, LinxscarouselComponent],
  templateUrl: './mainpanel.component.html',
  styleUrl: './mainpanel.component.css'
})
export class MainpanelComponent{
  public showMeetingZone = signal(false);
}
