import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';

@Component({
  selector: 'app-beliefsfilter',
  standalone: true,
  imports: [],
  templateUrl: './beliefsfilter.component.html',
  styleUrl: './beliefsfilter.component.css'
})
export class BeliefsfilterComponent {
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();

  public hasReligion = signal<boolean>(false);

  setHasReligion(event : any){
    const value = event.target.value;
    const hasReligion : boolean = (value === 'true');
    this.userPreferences.beliefs.hasReligion = hasReligion;
  }
  setUserBeliefsPref(event : any){
    const value = event.target.value;
    const sharedBeliefs : boolean = (value === 'true');
    this.userPreferences.beliefs.sharedBeliefs = sharedBeliefs;
  }
}
