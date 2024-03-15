import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { IFiltering } from '../../../../models/userprofile/filteringProfile';
import {AgefilterComponent} from '../signupfilters/agefilter/agefilter.component';
import { GenderfilterComponent } from '../signupfilters/genderfilter/genderfilter.component';
import { BeliefsfilterComponent } from '../signupfilters/beliefsfilter/beliefsfilter.component';
import { PoliticsfilterComponent } from '../signupfilters/politicsfilter/politicsfilter.component';
import { DietfilterComponent } from '../signupfilters/dietfilter/dietfilter.component';
import { LangfilterComponent } from '../signupfilters/langfilter/langfilter.component';
import { WorkfilterComponent } from '../signupfilters/workfilter/workfilter.component';
import { ProxyfilterComponent } from '../signupfilters/proxyfilter/proxyfilter.component';
@Component({
  selector: 'app-signup-userdata',
  standalone: true,
  imports: [ ReactiveFormsModule, MatIconModule,
              AgefilterComponent, 
              GenderfilterComponent,
              BeliefsfilterComponent,
              PoliticsfilterComponent,
              DietfilterComponent,
              LangfilterComponent,
              WorkfilterComponent,
              ProxyfilterComponent
            ],
  templateUrl: './signup-userdata.component.html',
  styleUrl: './signup-userdata.component.css'
})
export class SignupUserdataComponent {

  public userDataForm! : FormGroup;
  public filtersFormShowing : Boolean = true;
  public userProfFormShowing : Boolean = false;
  
  public sectionPag = signal(0);
  public validAge : boolean = false;
  
  public UserPreferences : IFiltering = {
    birthday : new Date (0,0,0),
    ageRange : {
      fromAge : 16,
      toAge : 120
    },
    myGender : '',
    genders : [],
    location : '',
    proxyRange : 'city',
    beliefs : {
        hasReligion : false,
        sharedBeliefs : false
    },
    politics : {
        politicalSpectrum: 'none',
        sharePolitics : 'false'
    },
    diet : {
        mydiet : 'omnivore',
        sharedDiet : false
    },
    language : {
        mylanguages : ['Español'],
        theirlanguages : ['Español']    
    },
    work : {
        myIndustry: 'other',
        shareIndustry: 'false'
    }
  } 

  constructor(private _formBuilder : FormBuilder){

    

    this.userDataForm = _formBuilder.group ({
                                                  userAge : _formBuilder.control ({
                                                    year : 0,
                                                    month : 0,
                                                    day : 0
                                                  }),
                                                  gender : _formBuilder.control({
                                                    mygender : '',
                                                    theirgenders : []
                                                  }),
                                                  username : new FormControl(),
                                                  name : new FormControl(),
                                                  lastname : new FormControl(),
                                                  email : new FormControl(),
                                                  password : new FormControl(),
                                                  reppassword : new FormControl()
                                              });

  }

  signup(){
    console.log('TUS ASQUEROSAS TENDENCIAS : ', this.UserPreferences)
  }

  nextPag(){
    console.log('valid ---> ', this.userDataForm.get('userAge')!.errors)
    if(this.userDataForm.get('userAge')!.errors === null){
        if(!this.userDataForm.get('gender')?.pristine && this.userDataForm.get('gender')?.errors === null){
          this.sectionPag.update((value)=>{
            if(value < 8){
              return value + 1
            }else{
              return value
            }
            
          } );
        }
    }
    
  }

  prevPag(){
    this.sectionPag.update((value)=>{
      if(value > 0){
        return value -1 
      }else{
        return value
      }
      
    } );
  }

  onUserPreferencesChange(newPref : any){
    
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
