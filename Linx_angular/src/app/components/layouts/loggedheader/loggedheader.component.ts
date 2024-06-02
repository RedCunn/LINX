import { Component, OnInit, inject, signal } from '@angular/core';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { IAccount } from '../../../models/useraccount/IAccount';
import { Router } from '@angular/router';
import {MyChainComponent} from '../../mychain/mychain.component'

@Component({
  selector: 'app-loggedheader',
  standalone: true,
  imports: [MyChainComponent],
  templateUrl: './loggedheader.component.html',
  styleUrl: './loggedheader.component.css'
})
export class LoggedheaderComponent implements OnInit {
  
  private signalStoreSvc : SignalStorageService = inject(SignalStorageService);

  public isMyChainOpen = signal(false);
  public isMyChain = signal(true);
  public myChain! : IAccount[];

  constructor(private router : Router){
    let _userdata = this.signalStoreSvc.RetrieveUserData();
  }

  ngOnInit(): void {
    this.myChain = this.signalStoreSvc.RetrieveMyChain()();
    this.isMyChain.set(true);
  }

  goInit(){
    this.router.navigateByUrl(`/Linx/Inicio`);
  }
  goHome(){
    this.router.navigateByUrl(`/Linx/Home`);
  }

  toggleMyChainModal() {
    this.isMyChainOpen.update(v => !v);
  }

}
