import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';
import { IUser } from '../../../../../models/userprofile/user';

@Component({
  selector: 'app-workfilter',
  standalone: true,
  imports: [],
  templateUrl: './workfilter.component.html',
  styleUrl: './workfilter.component.css'
})
export class WorkfilterComponent {

  @Input() userProfile! : IUser;
  @Output() userProfileChange = new EventEmitter<IUser>();
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();

  public hasOtherIndustry = signal<boolean>(false);

  setUserWorkPref(event : any){
    this.userPreferences.shareIndustry = event.target.value;
    this.userProfileChange.emit(this.userProfile);
    this.userPreferencesChange.emit(this.userPreferences);
  }
}
