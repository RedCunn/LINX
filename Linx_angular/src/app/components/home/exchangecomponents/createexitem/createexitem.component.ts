import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-createexitem',
  standalone: true,
  imports: [],
  templateUrl: './createexitem.component.html',
  styleUrl: './createexitem.component.scss'
})
export class CreateexitemComponent {

  public itemTags = signal<String[]>([]);
  @ViewChild('selectItemTags') selectItemTags !: ElementRef;
  public wishList = signal<String[]>([]);
  @ViewChild('selectWish') selectWish !: ElementRef;

  constructor( private location : Location){}

  goToExchangePanel(){
    this.location.back();
  }

  addWish(){

  }

  addTag(){

  }

  removeItemTag(item: String) {
    this.itemTags.update(values => values.filter(l => l !== item));
  }
  addItemTag() {
    const newTag = this.selectItemTags.nativeElement.value;
    const trimtag = newTag.trim();
    if( trimtag !== ''){
      this.itemTags.update(values => {
      
        if(values.find(v => v === trimtag)){
          return[...values];
        }
        return [...values, trimtag]
      })
  
    }
    
  }
  removeWishFromList(item: String) {
    this.wishList.update(values => values.filter(l => l !== item));
  }
  addWishToList() {
    const newWish = this.selectWish.nativeElement.value;
    const trimwish = newWish.trim();
    if( trimwish !== ''){
      this.wishList.update(values => {
      
        if(values.find(v => v === trimwish)){
          return[...values];
        }
        return [...values, trimwish]
      })
  
    }
    
  }
}
