import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, inject, signal} from '@angular/core';
import { Event, NavigationStart, Router, RouterEvent, RouterModule } from '@angular/router';
import { MainheaderComponent } from './components/layouts/mainheader/mainheader.component';
import {FooterComponent} from './components/layouts/mainfooter/footer.component';
import { Observable, filter, map } from 'rxjs';
import { SignalStorageService } from './services/signal-storage.service';
import { WebsocketService } from './services/websocket.service';
import { initFlowbite } from 'flowbite';
import { isPlatformBrowser } from '@angular/common';

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
  public routePattern : RegExp = new RegExp("/Linx/(Login|Registro|error)", "g");
  public showStickyFooter = signal(true);


  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router : Router){
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart ) {
        if(event.url.match(this.routePattern)){
          this.showStickyFooter.set( false)
        }else{
          this.showStickyFooter.set(true)
        }
      }
    })
  }
  ngOnInit(): void {
    //this.websocketsvc.connect()
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  }
  ngOnDestroy(): void {
    //this.websocketsvc.disconnect()
  }


}
