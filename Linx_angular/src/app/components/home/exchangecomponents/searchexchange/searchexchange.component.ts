import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-searchexchange',
  standalone: true,
  imports: [],
  templateUrl: './searchexchange.component.html',
  styleUrl: './searchexchange.component.css'
})
export class SearchexchangeComponent {

  constructor( private location : Location){}

  goToExchangePanel(){
    this.location.back();
  }
}
