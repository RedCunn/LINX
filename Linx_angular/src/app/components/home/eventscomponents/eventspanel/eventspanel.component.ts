import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventspanel',
  standalone: true,
  imports: [],
  templateUrl: './eventspanel.component.html',
  styleUrl: './eventspanel.component.css'
})
export class EventspanelComponent {


  constructor(private router : Router){}

  goToSearchEvents(){
    this.router.navigateByUrl('/Linx/BuscarEvento');
  }

  goToNewEventForm(){
    this.router.navigateByUrl('/Linx/CrearEvento');
  }

}
