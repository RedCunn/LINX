import { Component, EventEmitter, Input, computed, inject, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { IArticle } from '../../../../models/useraccount/IArticle';
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
  @Input() articleChange = new EventEmitter<IArticle>();

  private formData : FormData = new FormData();
  public currentDate : Date = new Date();

  generateArticleId() {
    const randomBytes = CryptoJS.lib.WordArray.random(8);
    const articleId = CryptoJS.enc.Hex.stringify(randomBytes);
    return articleId;
  }

  generateFileName(originalName : string) {
    const fileExtention = '.'+originalName.split('.')[1];
    const hash = CryptoJS.SHA256(originalName).toString(CryptoJS.enc.Base64);
    return hash.replace(/\//g, '_').replace(/\+/g, '-').substring(0, 16) + fileExtention;
  }
  async uploadArticle(artForm: NgForm) {
    
    if(artForm.form.invalid){
      return;
    }

    this.formData.append('title', artForm.form.get('title')?.value)
    this.formData.append('body', artForm.form.get('bodycontent')?.value)
    this.formData.append('useAsProfilePic', artForm.form.get('useAsUserPic')?.value)
    this.formData.append('postedOn', this.currentDate.toISOString())
    

    if (this.article.articleid !== undefined) {
      
      try {
        const response = await this.restSvc.editArticle(this.userdata!.userid,this.article.articleid, this.formData);
        if (response.code === 0) {
          console.log('Article uploaded : ', response.message)
          this.articleChange.emit(this.article);
          this.isOpen.set(false);
        } else {
          console.log('Error en AWAIT editArticle : ',response.error)
        } 
      } catch (error) {
        console.log('Error en AWAIT editArticle : ',error)
      }

    } else {
      const _artid = this.generateArticleId();
      this.formData.append('articleid', _artid.toString());
      try {
        const response = await this.restSvc.newArticle(this.userdata!.userid, this.formData);
        if (response.code === 0) {
          console.log('Article uploaded : ', response.message)
          this.articleChange.emit(this.article);
          this.isOpen.set(false);
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
    const newFileName = this.generateFileName(file.name);
    this.formData.append("file", file, newFileName);
    }
  }

  closeModal() {
    this.isOpen.set(false);
  }

}
