import {Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { initDropdowns, initFlowbite} from 'flowbite';
import { MatIcon } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userhomeaside',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './userhomeaside.component.html',
  styleUrl: './userhomeaside.component.css'
})
export class UserhomeasideComponent implements OnInit{
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router : Router) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
      initDropdowns();
    }
  }
  goToEventsPanel(){
    this.router.navigateByUrl("/Linx/Home/Events");
  }

  goToExchangePanel(){
    this.router.navigateByUrl("/Linx/Home/Exchange");
  }

  goToTracksLib(){
    this.router.navigateByUrl("/Linx/Trackslib");
  }

  goToAlbumsLib(){
    this.router.navigateByUrl("/Linx/Albumslib");
  }

  goToPodcastsLib(){
    this.router.navigateByUrl("/Linx/Podcastslib");
  }

  goToArtistsLib(){
    this.router.navigateByUrl("/Linx/Artistslib");
  }
}
