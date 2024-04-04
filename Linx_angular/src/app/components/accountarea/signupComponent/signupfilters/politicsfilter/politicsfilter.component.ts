import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';
import { IUser } from '../../../../../models/userprofile/user';

@Component({
  selector: 'app-politicsfilter',
  standalone: true,
  imports: [],
  templateUrl: './politicsfilter.component.html',
  styleUrl: './politicsfilter.component.css'
})
export class PoliticsfilterComponent {
  
  @Input() userProfile! : IUser;
  @Output() userProfileChange = new EventEmitter<IUser>();
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();

  setUserPolitics(event : any){
    this.userProfile.politics = event.target.value;
    this.userProfileChange.emit(this.userProfile);
  }
  setUserPoliPref (event : any){
    this.userPreferences.sharePolitics = event.target.value;
    this.userPreferencesChange.emit(this.userPreferences);
  }
}
