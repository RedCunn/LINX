import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';

@Component({
  selector: 'app-dietfilter',
  standalone: true,
  imports: [],
  templateUrl: './dietfilter.component.html',
  styleUrl: './dietfilter.component.css'
})
export class DietfilterComponent {

  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();

  setUserDiet(event : any){
    this.userPreferences.diet.mydiet = event.target.value;
  }
  setUserDietPref(event : any){
    const value = event.target.value;
    const shareDiet : boolean = (value === 'true');
    this.userPreferences.diet.sharedDiet = shareDiet;
    this.userPreferencesChange.emit(this.userPreferences);
  }
}
