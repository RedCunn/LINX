import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';
import { IUser } from '../../../../../models/userprofile/user';

@Component({
  selector: 'app-dietfilter',
  standalone: true,
  imports: [],
  templateUrl: './dietfilter.component.html',
  styleUrl: './dietfilter.component.css'
})
export class DietfilterComponent {

  @Input() userProfile! : IUser;
  @Output() userProfileChange = new EventEmitter<IUser>();
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();

  setUserDiet(event : any){
    this.userProfile.diet = event.target.value;
    this.userProfileChange.emit(this.userProfile)
  }
  setUserDietPref(event : any){
    const value = event.target.value;
    const shareDiet : boolean = (value === 'true');
    this.userPreferences.shareDiet = shareDiet;
    this.userPreferencesChange.emit(this.userPreferences);
  }
}
