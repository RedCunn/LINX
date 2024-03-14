import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';

@Component({
  selector: 'app-genderfilter',
  standalone: true,
  imports: [],
  templateUrl: './genderfilter.component.html',
  styleUrl: './genderfilter.component.css'
})
export class GenderfilterComponent {

  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();

  public userGenderPrefsList = signal<String[]>([]);

  setGenderPref (gen : any){
   
    const selectedGen : String = gen.target.value;
    const checked : boolean = gen.target.checked;

    if(checked){
        this.userGenderPrefsList.update(values => {
          return [...values, selectedGen]
      })
    }else{
      this.userGenderPrefsList.update(values =>   values.filter(g => g !== selectedGen))
    }
    this.userPreferences.genders = this.userGenderPrefsList();
  }

}
