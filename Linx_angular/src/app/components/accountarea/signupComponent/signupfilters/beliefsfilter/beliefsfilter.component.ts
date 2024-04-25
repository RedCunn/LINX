import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { IUser } from '../../../../../models/userprofile/IUser';

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

  setHasReligion(event : any){
    const value = event.target.value;
    const hasReligion : boolean = (value === 'true');
    this.userProfile.beliefs.hasReligion = hasReligion;
    this.userProfileChange.emit(this.userProfile);
  }
}
