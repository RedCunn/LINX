import { Component, Input, inject, signal } from '@angular/core';
import { IAccount } from '../../../models/useraccount/IAccount';
import { Router } from '@angular/router';
import { IUser } from '../../../models/userprofile/IUser';
import { SignalStorageService } from '../../../services/signal-storage.service';

@Component({
  selector: 'app-linxsonchain',
  standalone: true,
  imports: [],
  templateUrl: './linxsonchain.component.html',
  styleUrl: './linxsonchain.component.css'
})
export class LinxsonchainComponent {

  @Input() isMyChain = signal(false)
  @Input() chain : {chainid : string , chainname : string , linxs : IAccount[]} = {chainid : '' , chainname : '' , linxs : []}
  @Input() isOpen = signal(false);

  private signalStorageSvc = inject(SignalStorageService);
  private router = inject(Router);
  private _user! : IUser | null; 

  goToLinxProfile(linx : IAccount){
    this.isOpen.set(false);
    this.signalStorageSvc.StoreCandidateData(null);
    this.signalStorageSvc.StoreLinxData(linx);
    this.router.navigateByUrl(`/Linx/Profile/${linx.linxname}`);
  }

  closeModal (){
    this.isOpen.set(false);
  }
}
