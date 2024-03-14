import { Component, Input, Output , EventEmitter, signal, OnInit} from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';


@Component({
  selector: 'app-agefilter',
  standalone: true,
  imports: [MatSliderModule],
  templateUrl: './agefilter.component.html',
  styleUrl: './agefilter.component.css'
})
export class AgefilterComponent{

  
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();


  days: number[] = [];
  months: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  years: number[] = Array.from({ length: 100 }, (el, pos) => (new Date(Date.now()).getFullYear() - 16) - pos);

  public birthYear : number = 0;
  public birthMonth : number = 0;
  public birthDay : number = 0;

  setUserBirthday(){
    if(this.birthYear !== 0 && this.birthMonth !== 0 && this.birthDay !== 0){
      const userBirthday : Date = new Date(this.birthYear, this.birthMonth, this.birthDay);
      this.userPreferences.birthday = userBirthday;
      console.log("USER CUMPLLE : ", userBirthday);
    }

  }  

  loadDaysOfMonth(value: string) {
    if (value === '-1') {
      this.days = [];
    } else {
      let month: number = parseInt(value);
      if (month % 2 === 0) {
        if (month === 2) {
          this.days = Array.from({ length: 29 }, (el, pos) => pos + 1);
        } else {
          this.days = Array.from({ length: 30 }, (el, pos) => pos + 1);
        }
      } else {
        this.days = Array.from({ length: 31 }, (el, pos) => pos + 1);
      }

    }

  }
  setFromAgeRange(event : any){
   this.userPreferences.ageRange.fromAge = event.target.value;
   console.log(this.userPreferences.ageRange)
  }
  setToAgeRange(event : any){
    this.userPreferences.ageRange.toAge = event.target.value;
    console.log(this.userPreferences.ageRange)
  }



}
