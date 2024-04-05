import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trackslib',
  standalone: true,
  imports: [],
  templateUrl: './trackslib.component.html',
  styleUrl: './trackslib.component.css'
})
export class TrackslibComponent {

  constructor(private router : Router){}

  goToSearchAudio(){
    this.router.navigateByUrl('/Linx/Buscaraudio');
  }
}
