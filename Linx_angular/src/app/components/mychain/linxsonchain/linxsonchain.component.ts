import { Component, Input, inject, signal } from '@angular/core';
import { IAccount } from '../../../models/useraccount/IAccount';
import { Router } from '@angular/router';
import { IUser } from '../../../models/userprofile/IUser';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { IChainGroup } from '../../../models/userprofile/IChainGroup';
import { RestnodeService } from '../../../services/restnode.service';
import { IArticle } from '../../../models/useraccount/IArticle';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-linxsonchain',
  standalone: true,
  imports: [],
  templateUrl: './linxsonchain.component.html',
  styleUrl: './linxsonchain.component.css'
})
export class LinxsonchainComponent {

  @Input() isMyChain = signal(false)
  @Input() isSharedChain = signal(false)
  @Input() isAllChains = signal(false)
  @Input() chain! : IChainGroup;
  @Input() group! : IAccount[];
  @Input() isOpen = signal(false);

  private signalStorageSvc = inject(SignalStorageService);
  private restsvc = inject(RestnodeService);
  private utilsvc = inject(UtilsService);
  private router = inject(Router);
  private _user! : IUser | null; 
  private linxArticles : IArticle[] = []; 

  goToLinxProfile(linx : IAccount){
    this.isOpen.set(false);
    this.signalStorageSvc.StoreCandidateData(null);
    //!AQUI HAGO PETICION DE ARTICULOS E INICIO CHAT SI VENGO DEL LOGGEDHEADER
    if(this.isAllChains()){
      const wholeAccount = this.utilsvc.putArticleObjectsIntoAccounts([linx], this.linxArticles) 
      this.signalStorageSvc.StoreLinxData(wholeAccount[0]);
    }else{
      this.signalStorageSvc.StoreLinxData(linx);
    }
    
    this.router.navigateByUrl(`/Linx/Profile/${linx.linxname}`);
  }

  async getWholeProfile(linxid : string){
    try {
      const res = await this.restsvc.getAccountArticles(linxid);
      if(res.code === 0){
        console.log('En LINXSONCHAIN : ', res.message)
        this.linxArticles = res.userdata as IArticle[];
      }else{
        console.log('Error recuperando articulos en LINXSONCHAIN : ', res.error)
      }
    } catch (error) {
      console.log('Error recuperando articulos en LINXSONCHAIN : ', error)
    }
  }

  closeModal (){
    this.isOpen.set(false);
  }
}
