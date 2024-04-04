import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';
import { ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../../../../models/userprofile/user';

@Component({
  selector: 'app-genderfilter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './genderfilter.component.html',
  styleUrl: './genderfilter.component.css',
  providers : []
})
export class GenderfilterComponent {
  
  @Input() validateGender! : boolean;
  @Input() userProfile! : IUser;
  @Output() userProfileChange = new EventEmitter<IUser>();
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();
  @Output() isValidGenders = new EventEmitter<boolean>;

  public isValid : boolean = false;
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

    if(this.userPreferences.genders.length > 0 && this.userProfile.gender !== ''){
      this.isValid = true;
      this.isValidGenders.emit(true);
      this.userProfileChange.emit(this.userProfile);
      this.userPreferencesChange.emit(this.userPreferences)
    }else{
      this.isValid = false;
      this.isValidGenders.emit(false);
      this.userProfileChange.emit(this.userProfile);
      this.userPreferencesChange.emit(this.userPreferences)
    }

  }

}
