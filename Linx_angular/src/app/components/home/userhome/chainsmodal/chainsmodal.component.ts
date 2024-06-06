import { Component, EventEmitter, Input, OnInit, Output, inject, signal} from '@angular/core';
import {CommonModule , NgFor} from '@angular/common';
import { IUser } from '../../../../models/userprofile/IUser';
import { IAccount } from '../../../../models/useraccount/IAccount';
import { WebsocketService } from '../../../../services/websocket.service';
import { SignalStorageService } from '../../../../services/signal-storage.service';
import { RestnodeService } from '../../../../services/restnode.service';
import { UtilsService } from '../../../../services/utils.service';


@Component({
  selector: 'app-chainsmodal',
  standalone: true,
  imports: [CommonModule , NgFor],
  templateUrl: './chainsmodal.component.html',
  styleUrl: './chainsmodal.component.css'
})
export class ChainsmodalComponent implements OnInit{

  @Input() isOpen = signal(false);
  @Input() userdata!: IUser | null;
  @Input() linxdata! : IAccount ;
  @Output() isChainRequestedchange= new EventEmitter<boolean>();
  @Output() isChainedchange = new EventEmitter<boolean>();
  @Output() chainRequestedAlert = new EventEmitter<boolean>();

  private socketsvc: WebsocketService = inject(WebsocketService);
  private restSvc: RestnodeService = inject(RestnodeService);

  public userchains : Map<string,string> = new Map<string,string>();
  public newchainname : string | null = null;
  public chainsToAdd : Map<string,string> = new Map<string,string>();

  closeModal() {
    this.isOpen.set(false);
  }

  onChainNameChange(event : any){
    let inputvalue = event.target.value ; 
    
    if(inputvalue.trim() !== ''){
      this.newchainname = inputvalue
    }else{
      this.newchainname = null;
    }
  }
  onIncludedChainChange(key : string , name : string, event : any){
    let inputvalue = event.target.value ; 
    console.log('input : ', inputvalue)
    if(inputvalue){
     this.chainsToAdd.set(key, name);
    }else{
      this.chainsToAdd.delete(key)
    }
  }

  async inviteToJoinChain() {
    try {
      if(this.newchainname !== null){
        this.chainsToAdd.set('new',this.newchainname);
      }
      const res = await this.restSvc.requestJoinChain(this.userdata!.userid!, this.linxdata!.userid!, this.chainsToAdd)
      if (res.code === 0) {
        if (res.message === 'REQUESTING') {
          this.isChainRequestedchange.emit(true);
          this.isChainedchange.emit(false);
          this.socketsvc.linxreqchain(this.linxdata.userid , this.userdata?.userid! , this.userdata?.account! , this.linxdata, this.chainsToAdd)
          this.isOpen.set(false)
        } else {
          this.isChainRequestedchange.emit(false);
          this.chainRequestedAlert.emit(false)
          this.isOpen.set(false)
        }
      } else {
        console.log(` ${this.linxdata?.linxname} couldnt get ${this.userdata?.account.linxname} 's invitation to join their chains on chainsmodal ...`)
      }
    } catch (error) {
      console.log('error in INVITING TO join chain on chainsmodal ...', error)
    }
  }


  ngOnInit(): void {
    let chainsMap = new Map<string, string>();
    this.userdata?.account.myChains?.forEach(chain => {
      chainsMap.set(chain.chainid , chain.chainname)
    })

    this.userchains = chainsMap
  }

}
