import { Component, Inject, inject } from '@angular/core';
import { SpotifyService } from '../../../../services/spotify.service';

@Component({
  selector: 'app-mymusic',
  standalone: true,
  imports: [],
  templateUrl: './mymusic.component.html',
  styleUrl: './mymusic.component.css'
})
export class MymusicComponent {

private spotifySvc = inject(SpotifyService);


}
