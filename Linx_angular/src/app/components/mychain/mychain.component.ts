import { Component, Input, OnInit, ViewChild, inject, signal } from '@angular/core';
import { RestnodeService } from '../../services/restnode.service';
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
    const signaluser= this.signalStorageSvc.RetrieveUserData();
    this._user = signaluser();
    const signalchain = this.signalStorageSvc.RetrieveMyChain();
    this.myChain = signalchain()!;
  }

}
