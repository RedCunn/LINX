import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RestnodeService } from '../../services/restnode.service';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { IAccount } from '../../models/useraccount/IAccount';
import { Router } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';
import { Subject, takeUntil } from 'rxjs';
import { IInteraction } from '../../models/userprofile/IInteraction';
import { IEvent } from '../../models/useraccount/IEvent';

@Component({
  selector: 'app-interactions',
  standalone: true,
  imports: [],
  templateUrl: './interactions.component.html',
  styleUrl: './interactions.component.css'
})
export class InteractionsComponent implements OnInit, OnDestroy {

  @Input() isOpen = signal(false)

  closeModal() {
    this.isOpen.set(false);
  }

  private restSvc = inject(RestnodeService);
  private signalStorageSvc = inject(SignalStorageService);
  private websocketsvc = inject(WebsocketService);
  private router = inject(Router);

  private _user!: IUser | null;
  public myMatches!: IAccount[];

  private destroy$ = new Subject<void>();
  public interactions: IInteraction = { matchingAccount: [], chainedAccount: [], newEvent: [], requestedChain: [] };

  constructor(private ref: ChangeDetectorRef) {
    this.websocketsvc.getInteractions().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      switch (data.type) {
        case 'match':
          this.interactions.matchingAccount!.unshift(data.interaction as IAccount);
          this.ref.detectChanges();
          break;
        case 'chain':
          console.log('CHAINED :::::::::::::::::', data.interaction)
          this.interactions.chainedAccount!.unshift(data.interaction as IAccount);
          this.ref.detectChanges();
          break;
        case 'reqchain':
          console.log('REQUESTED CHAIN :::::::::::::::::', data.interaction)
          this.interactions.requestedChain!.unshift(data.interaction as IAccount);
          this.ref.detectChanges();
          break;
        case 'event':
          this.interactions.newEvent!.unshift(data.interaction as IEvent);
          this.ref.detectChanges();
          break;
        default:
          break;
      }

    });
  }

  goToProfile(profile: IAccount) {
    this.isOpen.set(false);
    this.signalStorageSvc.StoreLinxData(profile);
    this.router.navigateByUrl(`/Linx/Profile/${profile.linxname}`);
  }

  async getMyInteractions() {
    try {
      const res = await this.restSvc.getMyMatches(this._user?.userid!);
      if (res.code === 0) {
        this.myMatches = res.others;
        //this.signalStorageSvc.StoreMatchesAccounts(res.others);
        this.signalStorageSvc.StoreMatches(res.userdata);
        this.myMatches.forEach(element => {
          this.interactions.matchingAccount!.push(element);
        });
      } else {
        console.log('interactions never found...', res.message)
      }

    } catch (error) {
      console.log('interactions never found...', error)
    }
  }

  removeInteraction() {

  }

  async ngOnInit(): Promise<void> {
    this._user = this.signalStorageSvc.RetrieveUserData()();
    await this.getMyInteractions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
