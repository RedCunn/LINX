import { Component, OnInit } from '@angular/core';
import { initDropdowns} from 'flowbite';

@Component({
  selector: 'app-userhomeaside',
  standalone: true,
  imports: [],
  templateUrl: './userhomeaside.component.html',
  styleUrl: './userhomeaside.component.css'
})
export class UserhomeasideComponent implements OnInit{

  ngOnInit(): void {
    initDropdowns();
  }
}
