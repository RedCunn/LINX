import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUser } from '../../../../../models/userprofile/IUser';

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

  setUserDiet(event : any){
    this.userProfile.diet = event.target.value;
    this.userProfileChange.emit(this.userProfile)
  }
  setUserDietPref(event : any){
    const value = event.target.value;
    const shareDiet : boolean = (value === 'true');
    this.userProfile.preferences.shareDiet = shareDiet;
    this.userProfileChange.emit(this.userProfile);
  }
}
