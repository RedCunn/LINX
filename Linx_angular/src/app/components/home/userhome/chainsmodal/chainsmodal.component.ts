import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { IUser } from '../../../../models/userprofile/IUser';
import { IAccount } from '../../../../models/useraccount/IAccount';
import { WebsocketService } from '../../../../services/websocket.service';
import { SignalStorageService } from '../../../../services/signal-storage.service';
import { RestnodeService } from '../../../../services/restnode.service';
import { UtilsService } from '../../../../services/utils.service';


@Component({
  selector: 'app-chainsmodal',
  standalone: true,
  imports: [],
  templateUrl: './chainsmodal.component.html',
  styleUrl: './chainsmodal.component.css'
})
export class ChainsmodalComponent implements OnInit{

  @Input() isOpen = signal(false);
  @Input() userdata!: IUser | null;
  @Input() linxdata! : IAccount ;
  @Output() isChainRequestedchange= new EventEmitter<boolean>();
  @Output() isChainedchange = new EventEmitter<boolean>();
  @Output() showAlertschange = new EventEmitter<{alert:string, isOpen : boolean}>();

  private socketsvc: WebsocketService = inject(WebsocketService);
  private signalStoreSvc: SignalStorageService = inject(SignalStorageService);
  private restSvc: RestnodeService = inject(RestnodeService);
  private utilsvc: UtilsService = inject(UtilsService);

  public userchains : string[] = [];
  public newchainname : string | null = null;
  public chainsToAdd : string [] = [];

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
  onChainSelected (event : any){
    let inputvalue = event.target.value ; 
    console.log('input : ', inputvalue)
    this.chainsToAdd.push(inputvalue);
  }

  async requestJoinChain() {
    try {
      if(this.newchainname !== null){
        this.chainsToAdd.push(this.newchainname);
      }
      const res = await this.restSvc.requestJoinChain(this.userdata!.userid!, this.linxdata!.userid!, this.chainsToAdd)
      if (res.code === 0) {
        if (res.message === 'REQUESTING') {
          this.isChainRequestedchange.emit(true);
          this.isChainedchange.emit(false);
        } else {
          this.isChainRequestedchange.emit(false);
          this.showAlertschange.emit({alert : 'all', isOpen : false})
          this.isChainedchange.emit(true);
          this.socketsvc.linxchain(this.linxdata?.userid!, this.userdata?.userid!, this.userdata?.account!, this.linxdata!)
          this.signalStoreSvc.StoreMyChain([this.linxdata])
        }
      } else {
        console.log(`${this.userdata?.account.linxname} and ${this.linxdata?.linxname} couldnt chain...`)
      }
    } catch (error) {
      console.log('error in requesting join chain...', error)
    }
  }


  ngOnInit(): void {
    let setNames = new Set<string>();
    this.userdata?.account.myChain?.forEach(chain => {
      setNames.add(chain.chainname)
    })

    this.userchains = [...setNames]
  }

}
