import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-albumslib',
  standalone: true,
  imports: [],
  templateUrl: './albumslib.component.html',
  styleUrl: './albumslib.component.scss'
})
export class AlbumslibComponent {

  constructor(private router : Router){}

  goToSearchAudio(){
    this.router.navigateByUrl('/Linx/Buscaraudio');
  }
}
