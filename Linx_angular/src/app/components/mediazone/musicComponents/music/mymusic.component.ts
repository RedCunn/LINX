import { Component, inject } from '@angular/core';
import { SpotifyService } from '../../../../services/spotify.service';
import { MY_SPOTIFYSERVICES_TOKEN } from '../../../../services/injectionToken';
import { FormsModule, NgForm } from '@angular/forms';
import { IRestMessage } from '../../../../models/restmessage';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ITrack } from '../../../../models/media/track';
import { IArtist } from '../../../../models/media/artist';
import { IAlbum } from '../../../../models/media/album';

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
  public tracksResults : ITrack[] = [];
  public artistsResults : IArtist[] = [];
  public albumsResults : IAlbum[] = [];

  async search(searchForm : NgForm){
    this.searchParams = {
      q: searchForm.value.q,
      type: searchForm.value.type
    };

    this.tracksResults = [];
    this.albumsResults = [];
    this.artistsResults = [];

    try {
      
      const _res : IRestMessage = await this.spotifySvc.searchTrack(this.searchParams);
      
      if (_res.code === 0) {
        console.log(_res.message)
        console.log('Resultados de la búsqueda:', _res.others);
        
        switch(this.searchParams.type){
            case 'track': 
            _res.others.forEach((item : any)=> {
              this.tracksResults.push(item );
            });
      
            break;
            case 'artist': 
            _res.others.forEach((item : any)=> {
              this.artistsResults.push(item );
            });
      
            break;
            case 'album': 
            _res.others.forEach((item : any)=> {
              this.albumsResults.push(item );
            });
      
            break;
        }
        

      } else {
        console.log(_res.message)
        console.error('Error en la búsqueda:', _res.message);
      }
    } catch (error) {
      console.error('Error en la llamada al backend:', error);
    }
  }

}
