import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventspanel',
  standalone: true,
  imports: [],
  templateUrl: './eventspanel.component.html',
  styleUrl: './eventspanel.component.scss'
})
export class EventspanelComponent {


  constructor(private router : Router){}

  goToSearchEvents(){
    this.router.navigateByUrl('/Linx/Home/Events/search');
  }

  goToNewEventForm(){
    this.router.navigateByUrl('/Linx/Home/Events/create');
  }

}
