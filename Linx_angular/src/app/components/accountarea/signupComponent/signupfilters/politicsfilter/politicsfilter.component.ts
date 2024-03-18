import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';

@Component({
  selector: 'app-politicsfilter',
  standalone: true,
  imports: [],
  templateUrl: './politicsfilter.component.html',
  styleUrl: './politicsfilter.component.css'
})
export class PoliticsfilterComponent {

  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();

  setUserPolitics(event : any){
    this.userPreferences.politics.politicalSpectrum = event.target.value;
    this.userPreferencesChange.emit(this.userPreferences);
  }
  setUserPoliPref (event : any){
    this.userPreferences.politics.sharePolitics = event.target.value;
    this.userPreferencesChange.emit(this.userPreferences);
  }
}
