import { Component, Input, computed, inject, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { IArticle } from '../../../../models/useraccount/IArticle';
import { SignalStorageService } from '../../../../services/signal-storage.service';
import { RestnodeService } from '../../../../services/restnode.service';
import { IUser } from '../../../../models/userprofile/IUser';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-articlemodalform',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './articlemodalform.component.html',
  styleUrl: './articlemodalform.component.css'
})
export class ArticlemodalformComponent {

  private restSvc: RestnodeService = inject(RestnodeService);

  @Input() isOpen = signal(false);
  @Input() userdata!: IUser | null;
  @Input() article!: IArticle;
  
  private formData : FormData = new FormData();
  public currentDate : Date = new Date();

  public formTitle = computed(()=> {
    if(this.article.artid !== null) {
      return 'Editar artículo'
    }else{
      return 'Nuevo artículo'
    } 
  })

 getRandomNumber(min : number, max : number) {
    const range = max - min + 1;
    const randomBytes = CryptoJS.lib.WordArray.random(6); 
    const randomNumber = randomBytes.words[0] % range + min; 
    return randomNumber;
  }

  async uploadArticle(artForm: NgForm) {
    
    this.formData.append('title', artForm.form.get('title')?.value)
    this.formData.append('body', artForm.form.get('bodycontent')?.value)
    this.formData.append('useAsProfilePic', artForm.form.get('useAsUserPic')?.value)
    this.formData.append('postedOn', this.currentDate.toISOString())
    

    if (this.article.artid !== undefined) {
      
      try {
        const response = await this.restSvc.editArticle(this.userdata!.userid,this.article.artid, this.formData);
        if (response.code === 0) {
          console.log('Article uploaded : ', response.message)
        } else {
          console.log('Error en AWAIT editArticle : ',response.error)
        } 
      } catch (error) {
        console.log('Error en AWAIT editArticle : ',error)
      }

    } else {
      const _artid = this.getRandomNumber(1,100);
      this.formData.append('articleid', _artid.toString());
      try {
        const response = await this.restSvc.newArticle(this.userdata!.userid, this.formData);
        if (response.code === 0) {
          console.log('Article uploaded : ', response.message)
        } else {
          console.log('Error en AWAIT newArticle : ',response.error)
        }  
      } catch (error) {
        console.log('Error en AWAIT newArticle : ',error)
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
    this.article.img = file.name;
    this.formData.append("file", file, file.name);
    }
  }

  closeModal() {
    this.isOpen.set(false);
  }

}
