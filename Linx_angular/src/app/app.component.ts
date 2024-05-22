import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewContainerRef, inject, signal } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router, RouterEvent, RouterModule } from '@angular/router';
import { MainheaderComponent } from './components/layouts/mainheader/mainheader.component';
import { FooterComponent } from './components/layouts/mainfooter/footer.component';
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
export class AppComponent implements OnInit, OnDestroy {
  title = 'Linx_angular';

  private websocketsvc: WebsocketService = inject(WebsocketService);
  public routePattern: RegExp = new RegExp("(/Linx/(Login|Registro|error|registrada|activa)|^/?$)", "g");
  public showStickyFooter = signal(true);

  private vcr = inject(ViewContainerRef);
  public footercompo : any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (!event.url.match(this.routePattern)) {
          this.loadFooter();
        }else{
          this.vcr.clear();
        } 
      }
    })
  }

  async loadFooter (){
    this.vcr.clear();
    this.footercompo = this.vcr.createComponent(FooterComponent);
  }

  ngOnInit(): void {
    this.websocketsvc.connect()
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
    this.websocketsvc.linxConnected();
  }
  ngOnDestroy(): void {
    this.websocketsvc.disconnect()
  }


}
