import { Component, inject } from '@angular/core';
import { SpotifyService } from '../../../../services/spotify.service';
import { MY_SPOTIFYSERVICES_TOKEN } from '../../../../services/injectionToken';
import { FormsModule, NgForm } from '@angular/forms';
import { IRestMessage } from '../../../../models/restmessage';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-mymusic',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mymusic.component.html',
  styleUrl: './mymusic.component.css',
  providers: []
})

export class MymusicComponent {

  private spotifySvc : SpotifyService = inject(SpotifyService);
  public searchParams : {q : String, type : String} = {q : '', type : ''};

  async search(searchForm : NgForm){
   this.searchParams = {
    q: searchForm.value.q,
    type: searchForm.value.type
  };

  try {
    
    const _res : IRestMessage = await this.spotifySvc.searchTrack(this.searchParams);
    
    if (_res.code === 0) {
      console.log('Resultados de la búsqueda:', _res.others);
    } else {
    
      console.error('Error en la búsqueda:', _res.message);
    }
  } catch (error) {
    
    console.error('Error en la llamada al backend:', error);
  }
  }

}
