import { Component, EventEmitter, Input, Output, forwardRef, signal } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-genderfilter',
  standalone: true,
  imports: [],
  templateUrl: './genderfilter.component.html',
  styleUrl: './genderfilter.component.css',
  providers : [
    {provide: NG_VALUE_ACCESSOR, useExisting : forwardRef(()=> GenderfilterComponent), multi: true},
    {provide : NG_VALIDATORS, useExisting : forwardRef(()=> GenderfilterComponent), multi: true}
  ]
})
export class GenderfilterComponent implements ControlValueAccessor, Validator{
  
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();

  public userGenderPrefsList = signal<String[]>([]);

  private _onChange : Function = (_value : {mygender: string, theirgenders : string[]}) => {}
  private _onTouch : Function = (_value : {mygender: string, theirgenders : string[]}) => {}

  constructor(private _FB : FormBuilder){
    this.genderForm.valueChanges.pipe(debounceTime(100))
                                .subscribe(()=> {
                                  this._onChange(this.genderForm.value)
                                  this._onTouch(this.genderForm.value)
                                }) 
  }

  public genderForm : FormGroup = this._FB.group({
    mygender : '',
    theirgenders : []
  })

  //#region .............. Control Value Accessor
    writeValue(obj: {mygender : string, theirgenders : string[]}): void {
      this.genderForm.setValue(obj);
    }
    registerOnChange(fn: Function): void {
      this._onChange = fn;
    }
    registerOnTouched(fn: Function): void {
      this._onTouch = fn;
    }
  //#endregion
  
  validate(_control: AbstractControl<any, any>): ValidationErrors | null {
    return this.genderForm.valid? null : {nogenderselected : true}
  }

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
