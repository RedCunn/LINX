import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { Event, NavigationStart, Router, RouterEvent, RouterModule } from '@angular/router';
import { MainheaderComponent } from './components/layouts/mainheader/mainheader.component';
import { FooterComponent } from './components/layouts/mainfooter/footer.component';
import { SignalStorageService } from './services/signal-storage.service';
import { WebsocketService } from './services/websocket.service';
import { initFlowbite } from 'flowbite';
import { isPlatformBrowser } from '@angular/common';
import { RestnodeService } from './services/restnode.service';
import { IUser } from './models/userprofile/IUser';
import * as crypto from 'crypto-js';
import { IAccount } from './models/useraccount/IAccount';

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
  private restSvc: RestnodeService = inject(RestnodeService);
  private signalSvc: SignalStorageService = inject(SignalStorageService);
  public routePattern: RegExp = new RegExp("/Linx/(Login|Registro|error)", "g");
  public showStickyFooter = signal(true);

  private _user!: IUser | null;
  private _chain : IAccount[] = [];
  

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (event.url.match(this.routePattern)) {
          this.showStickyFooter.set(false)
        } else {
          this.showStickyFooter.set(true)
        }
      }
    })
  }

  async createRooms() {
    const _jwtsignal = this.signalSvc.RetrieveJWT();
    try {
      const res = await this.restSvc.getMyChain(this._user?.userid!, _jwtsignal()!);

      if(res.code === 0){
        this._chain = res.others;
        this._chain.map((account , i ) => {
          let roomkey = crypto.lib.WordArray.random(10).toString(crypto.enc.Hex);
          
          this.websocketsvc.initChat();   
        })
        

      }  
    } catch (error) {
      
    }
    
  }

  ngOnInit(): void {
    this.websocketsvc.connect()
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
    this.websocketsvc.linxConnected();
    const _usersignal = this.signalSvc.RetrieveUserData();
    this._user = _usersignal();

    if (_usersignal() !== null ) {
      this.createRooms();
    }
  }
  ngOnDestroy(): void {
    this.websocketsvc.disconnect()
  }


}
