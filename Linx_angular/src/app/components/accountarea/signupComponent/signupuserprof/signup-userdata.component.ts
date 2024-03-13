import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SignupFiltersComponent } from '../signupFilters.component';
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
    birthday : new Date (Date.now()),
    ageRange : {
      fromAge : 16,
      toAge : 120
    },
    myGender : '',
    genders : [],
    location : '',
    proxyRange : '',
    beliefs : {
        religion : false,
        spiritual: false,
        sharedBeliefs : true
    },
    politics : {
        politicalSpectrum: '',
        sharedSpectrum : false
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
        sharedIndustry: false
    }
  } 

  constructor(){
    this.signupForm = new FormGroup ({
        
    });
  }

  signup(){

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
