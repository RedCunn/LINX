import { Component, Input, computed, inject, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { IArticle } from '../../../../models/useraccount/IArticle';
import { SignalStorageService } from '../../../../services/signal-storage.service';
import { RestnodeService } from '../../../../services/restnode.service';
import { IUser } from '../../../../models/userprofile/IUser';

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

  public formTitle = computed(()=> {
    if(this.article.artid !== null) {
      return 'Editar artículo'
    }else{
      return 'Nuevo artículo'
    } 
  })
  private _imgbase64: string = "";


  async uploadArticle(artForm: NgForm) {


    console.log("ARTICULOCULOCULO : ", artForm.form.value)
    let newArt: IArticle = artForm.form.value;
    newArt.img = this._imgbase64;
    console.log("ARTI : ", newArt)
    
    if (this.article.artid !== null) {

      try {
        const response = await this.restSvc.editArticle(this.userdata!.userid, newArt);
        if (response.code === 0) {
  
        } else {
  
        } 
      } catch (error) {
        console.log('Error en AWAIT editArticle : ',error)
      }

    } else {
      try {
        const response = await this.restSvc.newArticle(this.userdata!.userid, newArt);
        if (response.code === 0) {
  
        } else {
  
        }  
      } catch (error) {
        console.log('Error en AWAIT newArticle : ',error)
      }
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

  closeModal() {
    this.isOpen.set(false);
  }

}
