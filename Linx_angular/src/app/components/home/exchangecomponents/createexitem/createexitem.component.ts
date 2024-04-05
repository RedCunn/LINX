import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-createexitem',
  standalone: true,
  imports: [],
  templateUrl: './createexitem.component.html',
  styleUrl: './createexitem.component.css'
})
export class CreateexitemComponent {

  constructor( private location : Location){}

  goToExchangePanel(){
    this.location.back();
  }

  addWish(){

  }

  addTag(){

  }

}
