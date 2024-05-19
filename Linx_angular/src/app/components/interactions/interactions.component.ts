import { Component, Input, inject, signal } from '@angular/core';
import { RestnodeService } from '../../services/restnode.service';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { IAccount } from '../../models/useraccount/IAccount';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interactions',
  standalone: true,
  imports: [],
  templateUrl: './interactions.component.html',
  styleUrl: './interactions.component.css'
})
export class InteractionsComponent {

  @Input() isOpen = signal(false)

  closeModal(){
    this.isOpen.set(false);
  }

  private restSvc = inject(RestnodeService);
  private signalStorageSvc = inject(SignalStorageService);
  private router = inject(Router);
  private _user! : IUser | null; 
  public myMatches! : IAccount[];

  goToProfile(profile : IAccount){
    this.isOpen.set(false);
    this.signalStorageSvc.StoreLinxData(profile);
    this.router.navigateByUrl(`/Linx/Profile/${profile.linxname}`);
  }
  
  async getMyInteractions(){
    try {
      const res = await this.restSvc.getMyMatches(this._user?.userid!);

      if(res.code === 0){
        this.myMatches = res.others;
      }else{
        console.log('interactions never found...')
      }

    } catch (error) {
      console.log('interactions never found...', error)
    }
  }

  async ngOnInit(): Promise<void> {
    const signaluser= this.signalStorageSvc.RetrieveUserData() ;
    this._user = signaluser();
    if(signaluser() !== null){
      await this.getMyInteractions();
    }
  }
}
