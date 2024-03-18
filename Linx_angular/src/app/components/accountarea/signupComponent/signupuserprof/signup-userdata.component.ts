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
import { IUser } from '../../../../models/userprofile/user';
import { IAccount } from '../../../../models/useraccount/account';
import { compareToValidator } from '../../../../validators/compareTo';
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
  public validateAge : boolean =false;
  public validateGender : boolean = false;
  public isValidGenders : boolean = false;

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
        myIndustry: '',
        other: '',
        shareIndustry: 'false'
    }
  } 
  private UserAccount : IAccount = {
   accountid : '',
   userid : '',
   createdAt : new Date(),
   username : '',
   email : '',
   password : '',
   active : false
  }
  private NewUser : IUser = {
    userid : '',
    accountid : '',
    name : '',
    lastname : '',
    filters : this.UserPreferences,
    account : this.UserAccount
  }
  constructor(private _formBuilder : FormBuilder){

    

    this.userDataForm = _formBuilder.group ({
                                                  userAge : _formBuilder.control ({
                                                    year : 0,
                                                    month : 0,
                                                    day : 0
                                                  }),
                                                  username : new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
                                                  name : new FormControl('',[Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
                                                  lastname : new FormControl('',[Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
                                                  email : new FormControl('',[Validators.required, Validators.email]),
                                                  password : new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
                                                  reppassword : new FormControl('',[Validators.required, compareToValidator('password')])
                                              });

  }

  signup(){

    if(this.userDataForm.errors === null){
      const _userAge = this.userDataForm.get('userAge')?.value;
      const _year = _userAge.year;
      const _month = _userAge.month;
      const _day = _userAge.day;
      console.log('anio-',_year)
      console.log('mes-', _month)
      console.log('dia-', _day)
      this.UserPreferences.birthday = new Date(_year, _month, _day);
      this.UserAccount.username = this.userDataForm.get('username')?.value;
      this.UserAccount.email = this.userDataForm.get('email')?.value;
      this.UserAccount.password = this.userDataForm.get('password')?.value;
  
      this.NewUser.name = this.userDataForm.get('name')?.value;
      this.NewUser.lastname = this.userDataForm.get('lastname')?.value;
      this.NewUser.account = this.UserAccount;
      this.NewUser.filters = this.UserPreferences;
  
      console.log('TUS ASQUEROSAS TENDENCIAS : ', this.NewUser)
    }else{
      console.log('INVALID FORM : ', this.userDataForm.errors)
    }

  }

  nextPag(){
    console.log('valid age---> ', this.userDataForm.get('userAge')!.errors)

    if(this.userDataForm.get('userAge')!.errors === null){
          this.sectionPag.update((value)=>{
            if(value < 8 ){
              if( value === 2 && !this.isValidGenders){
                console.log('MY GENDER ....', this.UserPreferences.myGender)
                console.log('GENDERS----', this.UserPreferences.genders)
                this.validateGender = true;
                return value;
              }
              return value + 1;
            }else{
              return value;
            }
            
          } );
    }else{
      this.validateAge = true;
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

  onValidGenders(valid : boolean){
    this.isValidGenders = valid;
  }

  onUserPreferencesChange(newPref : any){
    this.UserPreferences = newPref;  
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
