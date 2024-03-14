import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { RestnodeService } from '../../../../../services/restnode.service';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';
import { IRestMessage } from '../../../../../models/restmessage';

@Component({
  selector: 'app-proxyfilter',
  standalone: true,
  imports: [],
  templateUrl: './proxyfilter.component.html',
  styleUrl: './proxyfilter.component.css'
})
export class ProxyfilterComponent implements OnInit{

  private restnodeSvc : RestnodeService = inject(RestnodeService);
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();
  
  public userCurrentLocation = {latitude : 0, longitude : 0}
  public userCurrentAddress : string = '';

  async trackUserCurrentLocation(){
    navigator.geolocation.getCurrentPosition((position)=>{
      this.userCurrentLocation.latitude = position.coords.latitude;
      this.userCurrentLocation.longitude = position.coords.longitude;
      console.log("LOCATION : ", this.userCurrentLocation);

      this.getCurrentAddress(this.userCurrentLocation.latitude, this.userCurrentLocation.longitude)
    })

  }

  async getCurrentAddress(lat : number, long : number){
    try {
      const _res : IRestMessage = await this.restnodeSvc.trackUserLocationGoogleGeocode(lat, long)

      if(_res.code === 0){
        this.userCurrentAddress = _res.others;
        this.userPreferences.location = _res.others;
      }else{
        this.userCurrentAddress = 'no podemos localizarte... 🙎'
      }  
    } catch (error) {
      this.userCurrentAddress = 'no podemos localizarte... 🙎'
    }
    
  }

  ngOnInit(): void {
    this.trackUserCurrentLocation();  
  }

}
