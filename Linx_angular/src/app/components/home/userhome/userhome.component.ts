import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { UserhomeasideComponent } from '../userhomeaside/userhomeaside.component';
import { MatIcon } from '@angular/material/icon';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { IUser } from '../../../models/userprofile/IUser';
import { Modal, initFlowbite} from 'flowbite';
import { IArticle } from '../../../models/useraccount/IArticle';
import { isPlatformBrowser } from '@angular/common';
import { NgForm, FormsModule } from '@angular/forms';
import { RestnodeService } from '../../../services/restnode.service';

@Component({
  selector: 'app-userhome',
  standalone: true,
  imports: [UserhomeasideComponent, MatIcon, FormsModule],
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent implements OnInit{

  private signalStoreSvc : SignalStorageService = inject(SignalStorageService);
  private restSvc : RestnodeService = inject(RestnodeService);
  public userdata! : IUser |null;

  public article : IArticle = {artid : '', title : '', bodycontent : '', img : '', postedOn : '', useAsUserPic : false}

  private _imgbase64 : string = "";
  

  constructor(@Inject(PLATFORM_ID) private platformId: Object){
    let _userdata = this.signalStoreSvc.RetrieveUserData();

    if(_userdata() !== null){
      this.userdata = _userdata(); 
    }
   
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    

    if (file) {
        const reader = new FileReader();

        reader.onload = (event) => {
          const base64String = event.target!.result as string;
          this._imgbase64 = base64String; 
      };

        reader.readAsDataURL(file);
    }
}


  async createArticle(artForm : NgForm){

    
    console.log("ARTICULOCULOCULO : ", artForm.form.value)
    let newArt : IArticle = artForm.form.value;
    newArt.img = this._imgbase64;
    console.log("ARTI : ", newArt)
    //CREAR
    if(artForm.control.get('artid')?.value ===  ''){

      const response = await this.restSvc.uploadArticle({userid : this.userdata!.userid, article : newArt});

      if(response.code === 0){

      }else{
        
      }
      
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
