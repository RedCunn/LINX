import { Component, OnDestroy, OnInit, inject, signal} from '@angular/core';
import { Event, NavigationStart, Router, RouterEvent, RouterModule } from '@angular/router';
import { MainheaderComponent } from './components/layouts/mainheader/mainheader.component';
import {FooterComponent} from './components/layouts/mainfooter/footer.component';
import { Observable, filter, map } from 'rxjs';
import { SignalStorageService } from './services/signal-storage.service';
import { WebsocketService } from './services/websocket.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MainheaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Linx_angular';  
  
  public websocketsvc : WebsocketService = inject(WebsocketService);
  public routePattern : RegExp = new RegExp("/Linx/(Login|Registro)", "g");
  public showStickyFooter = signal(true);


  constructor(private router : Router){
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart ) {
        if(event.url.match(this.routePattern)){
          this.showStickyFooter.update(show => false)
        }else{
          this.showStickyFooter.update(show => true)
        }
      }
    })
  }
  ngOnInit(): void {
    // this.websocketsvc.connect()
    console.log('hi')
  }
  ngOnDestroy(): void {
    //this.websocketsvc.disconnect()
    console.log('adioh')
  }


}
