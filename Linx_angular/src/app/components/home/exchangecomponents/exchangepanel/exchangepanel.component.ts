import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exchangepanel',
  standalone: true,
  imports: [],
  templateUrl: './exchangepanel.component.html',
  styleUrl: './exchangepanel.component.css'
})
export class ExchangepanelComponent {

  constructor(private router : Router) {}
  

  goToSearchExchange(){
    this.router.navigateByUrl('/Linx/BuscarIntercambio');
  }
  goToNewExitemForm(){
    this.router.navigateByUrl('/Linx/CrearItem');
  }
}
