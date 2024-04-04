import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';
import { IUser } from '../../../../../models/userprofile/user';

@Component({
  selector: 'app-beliefsfilter',
  standalone: true,
  imports: [],
  templateUrl: './beliefsfilter.component.html',
  styleUrl: './beliefsfilter.component.css'
})
export class BeliefsfilterComponent {
  
  @Input() userProfile! : IUser;
  @Output() userProfileChange = new EventEmitter<IUser>();
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();

  public hasReligion = signal<boolean>(false);

  setHasReligion(event : any){
    const value = event.target.value;
    const hasReligion : boolean = (value === 'true');
    this.userProfile.beliefs.hasReligion = hasReligion;
    this.userProfileChange.emit(this.userProfile);
  }
  setUserBeliefsPref(event : any){
    const value = event.target.value;
    const sharedBeliefs : boolean = (value === 'true');
    this.userPreferences.shareBeliefs = sharedBeliefs;
    this.userPreferencesChange.emit(this.userPreferences);
  }
}
