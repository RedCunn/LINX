import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { IAccount } from '../../models/useraccount/IAccount';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mychain',
  standalone: true,
  imports: [],
  templateUrl: './mychain.component.html',
  styleUrl: './mychain.component.css'
})
export class MyChainComponent implements OnInit{

  @Input() isOpen = signal(false);
  @Input() isMyChain = signal(true);
  @Input() extendedChain ? : IAccount[];

  closeModal() {
    this.isOpen.set(false);
  }

  private signalStorageSvc = inject(SignalStorageService);
  private router = inject(Router);
  private _user! : IUser | null; 
  public myChain! : IAccount[];

  goToLinxProfile(linx : IAccount){
    this.isOpen.set(false);
    this.signalStorageSvc.StoreLinxData(linx);
    this.router.navigateByUrl(`/Linx/Profile/${linx.linxname}`);
  }

  ngOnInit(): void {
    this._user = this.signalStorageSvc.RetrieveUserData()();
    this.myChain = this.signalStorageSvc.RetrieveMyChain()();
  }

}
