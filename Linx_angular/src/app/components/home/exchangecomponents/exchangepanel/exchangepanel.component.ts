import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exchangepanel',
  standalone: true,
  imports: [],
  templateUrl: './exchangepanel.component.html',
  styleUrl: './exchangepanel.component.scss'
})
export class ExchangepanelComponent {

  constructor(private router : Router) {}
  

  goToSearchExchange(){
    this.router.navigateByUrl('/Linx/Home/Exchange/search');
  }
  goToNewExitemForm(){
    this.router.navigateByUrl('/Linx/Home/Exchange/create');
  }
}
