import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artistslib',
  standalone: true,
  imports: [],
  templateUrl: './artistslib.component.html',
  styleUrl: './artistslib.component.scss'
})
export class ArtistslibComponent {

  constructor(private router : Router){}

  goToSearchAudio(){
    this.router.navigateByUrl('/Linx/Buscaraudio');
  }
}
