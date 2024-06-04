import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Signal, ViewContainerRef, computed, inject, signal } from '@angular/core';
import { Event, NavigationStart, Router, RouterModule } from '@angular/router';
import { MainheaderComponent } from './components/layouts/mainheader/mainheader.component';
import { FooterComponent } from './components/layouts/mainfooter/footer.component';
import { LoggedheaderComponent } from './components/layouts/loggedheader/loggedheader.component';
import { WebsocketService } from './services/websocket.service';
import { initFlowbite } from 'flowbite';
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MainheaderComponent, FooterComponent, LoggedheaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Linx_angular';

  private websocketsvc: WebsocketService = inject(WebsocketService);
  private utilsvc : UtilsService = inject(UtilsService);
  public routePattern: RegExp = new RegExp("(/Linx/(Login|Registro|error|registrada|activa)|/Linx$|^/?$)", "g");
  public showStickyFooter = signal(true);

  private vcr = inject(ViewContainerRef);
  public footercompo: any;
  public headercompo: any;
  public isLogged = signal(false);

  private destroy$ = new Subject<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (!event.url.match(this.routePattern)) {
          this.isLogged.set(true);
          this.loadHeaderFooter();
        } else {
          this.vcr.clear();
          this.isLogged.set(false);
        }
      }
    })
    this.websocketsvc.getChatRequests().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      console.log('chat requests on app compo : ', data)
      const room = {userid : data.userid , roomkey : data.roomkey};
      this.utilsvc.joinRoom(room);
    });
  }

  loadHeaderFooter() {
    this.vcr.clear();
    this.headercompo = this.vcr.createComponent(LoggedheaderComponent);
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
