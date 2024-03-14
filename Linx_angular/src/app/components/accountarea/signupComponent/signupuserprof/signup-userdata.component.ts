import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SignupFiltersComponent } from '../signupfilters/signupFilters.component';
import { IFiltering } from '../../../../models/userprofile/filteringProfile';

@Component({
  selector: 'app-signup-userdata',
  standalone: true,
  imports: [MatPaginatorModule, SignupFiltersComponent, ReactiveFormsModule],
  templateUrl: './signup-userdata.component.html',
  styleUrl: './signup-userdata.component.css'
})
export class SignupUserdataComponent {


  public signupForm:FormGroup;
  public filtersFormShowing : Boolean = true;
  public userProfFormShowing : Boolean = false;

  public UserPreferences : IFiltering = {
    birthday : new Date (0,0,0),
    ageRange : {
      fromAge : 16,
      toAge : 120
    },
    myGender : '',
    genders : [],
    location : '',
    proxyRange : '',
    beliefs : {
        hasReligion : false,
        sharedBeliefs : false
    },
    politics : {
        politicalSpectrum: '',
        sharePolitics : 'false'
    },
    diet : {
        mydiet : '',
        sharedDiet : false
    },
    language : {
        mylanguages : ['es','en'],
        theirlanguages : ['es','en']    
    },
    work : {
        myIndustry: '',
        shareIndustry: 'false'
    }
  } 

  constructor(){
    this.signupForm = new FormGroup ({
        username : new FormControl(),
        name : new FormControl(),
        lastname : new FormControl(),
        email : new FormControl(),
        password : new FormControl(),
        reppassword : new FormControl
    });
  }

  signup(){
    console.log('TUS ASQUEROSAS TENDENCIAS : ', this.UserPreferences)
  }

  onUserPreferencesChange(newPrefs : IFiltering){

  }

  showFiltersForm(){
    this.filtersFormShowing = true ;
    this.userProfFormShowing = false;
  }

  showUserProfForm(){
    this.userProfFormShowing = true;
    this.filtersFormShowing = false;
  }


}
