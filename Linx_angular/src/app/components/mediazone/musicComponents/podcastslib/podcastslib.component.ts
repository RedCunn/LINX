import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-podcastslib',
  standalone: true,
  imports: [],
  templateUrl: './podcastslib.component.html',
  styleUrl: './podcastslib.component.css'
})
export class PodcastslibComponent {

  constructor(private router : Router){}

  goToSearchAudio(){
    this.router.navigateByUrl('/Linx/Buscaraudio');
  }
}
