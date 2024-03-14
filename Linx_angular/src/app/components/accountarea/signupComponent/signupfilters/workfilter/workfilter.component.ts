import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';

@Component({
  selector: 'app-workfilter',
  standalone: true,
  imports: [],
  templateUrl: './workfilter.component.html',
  styleUrl: './workfilter.component.css'
})
export class WorkfilterComponent {

  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();

  public hasOtherIndustry = signal<boolean>(false);

  setUserWorkPref(event : any){
    this.userPreferences.work.shareIndustry = event.target.value;
  }
}
