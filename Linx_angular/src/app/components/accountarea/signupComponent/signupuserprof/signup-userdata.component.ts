import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AgefilterComponent } from '../signupfilters/agefilter/agefilter.component';
import { GenderfilterComponent } from '../signupfilters/genderfilter/genderfilter.component';
import { PoliticsfilterComponent } from '../signupfilters/politicsfilter/politicsfilter.component';
import { DietfilterComponent } from '../signupfilters/dietfilter/dietfilter.component';
import { LangfilterComponent } from '../signupfilters/langfilter/langfilter.component';
import { WorkfilterComponent } from '../signupfilters/workfilter/workfilter.component';
import { ProxyfilterComponent } from '../signupfilters/proxyfilter/proxyfilter.component';
import { IUser } from '../../../../models/userprofile/IUser';
import { IAccount } from '../../../../models/useraccount/IAccount';
import { compareToValidator } from '../../../../validators/compareTo';
import { IRestMessage } from '../../../../models/IRestMessage';
import { RestnodeService } from '../../../../services/restnode.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-userdata',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule,
    AgefilterComponent,
    GenderfilterComponent,
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

  private restnodeSvc: RestnodeService = inject(RestnodeService);

  public userDataForm!: FormGroup;
  public filtersFormShowing: Boolean = true;
  public userProfFormShowing: Boolean = false;

  public sectionPag = signal(0);
  public validateAge: boolean = false;
  public validateGender: boolean = false;
  public isValidGenders: boolean = false;

  private UserAccount: IAccount = {
    _id: '',
    userid: '',
    createdAt: '',
    linxname: '',
    email: '',
    password: '',
    active: false
  }
  public UserProfile: IUser = {
    userid: '',
    accountid: '',
    name: '',
    lastname: '',
    preferences: {
      ageRange: {
        fromAge: 16,
        toAge: 120
      },
      genders: [],
      proxyRange: 'city',
      sharePolitics: 'false',
      shareDiet: false,
      languages: ['Español'],
      shareIndustry: 'false'
    },
    account: this.UserAccount,
    birthday: '',
    gender: '',
    location: {
      country_id: '',
      city_id: '',
      area1_id: '',
      area2_id: '',
      global_code: ''
    },
    diet: 'omnivore',
    languages: ['Español'],
    politics: 'none',
    work: {
      industry: '',
      other: ''
    }
  }
  constructor(private _formBuilder: FormBuilder, private router: Router) {

    this.userDataForm = _formBuilder.group({
      userAge: _formBuilder.control({
        year: 0,
        month: 0,
        day: 0
      }),
      linxname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
      reppassword: new FormControl('', [Validators.required, compareToValidator('password')])
    });

  }

  async signup() {

    if (this.userDataForm.valid) {
      const _userAge = this.userDataForm.get('userAge')?.value;
      const _year = _userAge.year;
      const _month = _userAge.month;
      const _day = _userAge.day;
      this.UserProfile.birthday = new Date(_year, _month - 1, _day).toISOString();
      this.UserAccount.linxname = this.userDataForm.get('linxname')?.value;
      this.UserAccount.email = this.userDataForm.get('email')?.value;
      this.UserAccount.password = this.userDataForm.get('password')?.value;
      this.UserAccount.createdAt = new Date().toISOString();
      this.UserProfile.name = this.userDataForm.get('name')?.value;
      this.UserProfile.lastname = this.userDataForm.get('lastname')?.value;
      this.UserProfile.account = this.UserAccount;

      try {
        const _response: IRestMessage = await this.restnodeSvc.signupNewUser(this.UserProfile);

        if (_response.code === 0) {
          this.router.navigateByUrl('/Linx/SignedUp');
        }


      } catch (error) {
        this.router.navigateByUrl('/Linx/error');
      }

    } else {
      console.log('INVALID FORM : ')
      this.showFormErrors(this.userDataForm);
    }

  }

  private showFormErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      if (control instanceof FormGroup) {
        this.showFormErrors(control);
      } else {
        if (control && control.errors) {
          Object.keys(control.errors).forEach(errorKey => {
            console.log(`Campo: ${controlName}, Error: ${errorKey}`);
          });
        }
      }
    });
  }
  nextPag() {

    if (this.userDataForm.get('userAge')!.errors === null) {
      this.sectionPag.update((value) => {
        if (value < 7) {
          if (value === 2 && !this.isValidGenders) {
            this.validateGender = true;
            return value;
          }
          return value + 1;
        } else {
          return value;
        }

      });
    } else {
      this.validateAge = true;
    }

  }

  prevPag() {
    this.sectionPag.update((value) => {
      if (value > 0) {
        return value - 1
      } else {
        return value
      }

    });
  }

  onValidGenders(valid: boolean) {
    this.isValidGenders = valid;
  }
  
  onUserProfileChange(newProf: any) {
    this.UserProfile = newProf;
  }

  showFiltersForm() {
    this.filtersFormShowing = true;
    this.userProfFormShowing = false;
  }

  showUserProfForm() {
    this.userProfFormShowing = true;
    this.filtersFormShowing = false;
  }


}
