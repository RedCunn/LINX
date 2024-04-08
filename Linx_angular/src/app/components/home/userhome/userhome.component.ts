import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { UserhomeasideComponent } from '../userhomeaside/userhomeaside.component';
import { MatIcon } from '@angular/material/icon';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { IUser } from '../../../models/userprofile/user';
import { Modal, initFlowbite} from 'flowbite';
import { IArticle } from '../../../models/useraccount/article';
import { isPlatformBrowser } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-userhome',
  standalone: true,
  imports: [UserhomeasideComponent, MatIcon],
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent implements OnInit{

  private signalStoreSvc : SignalStorageService = inject(SignalStorageService);
  public userdata! : IUser |null;

  public article : IArticle = {artid : '', title : '', bodycontent : '', img : '', postedOn : '', useAsUserPic : false}

  constructor(@Inject(PLATFORM_ID) private platformId: Object){
    let _userdata = this.signalStoreSvc.RetrieveUserData();

    if(_userdata() !== null){
      this.userdata = _userdata(); 
    }
   
  }

  editArt(artForm : NgForm){

    //CREAR
    if(artForm.control.get('artid')?.value ===  ''){

      
    }else{
      //EDITAR
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  }

}
