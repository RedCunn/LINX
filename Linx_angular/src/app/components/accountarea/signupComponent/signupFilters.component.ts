import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { initFlowbite } from 'flowbite';
import { IFiltering } from '../../../models/userprofile/filteringProfile';


@Component({
  selector: 'app-signup-Filters',
  standalone: true,
  imports: [ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatSliderModule],
  templateUrl: './signupFilters.component.html',
  styleUrl: './signupFilters.component.css'
})
export class SignupFiltersComponent implements OnInit {

  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();
  days: number[] = [];
  months: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  years: number[] = Array.from({ length: 100 }, (el, pos) => (new Date(Date.now()).getFullYear() - 16) - pos);
  @ViewChild('selectMyLangs') selectMyLangs !: ElementRef;
  @ViewChild('selectTheirLangs') selectTheirLangs !: ElementRef;
  public myLangList = signal<String[]>([]);
  public theirLangList = signal<String[]>([]);

  addMyLangItem(event : any) {
    const selectedLangs = this.selectMyLangs.nativeElement;
    const newLang = selectedLangs.options[selectedLangs.selectedIndex].value;
    
    this.myLangList.update(values => {
      
      if(values.find(v => v === newLang)){
        return[...values];
      }
      return [...values, newLang]
    })
  }
  removeMyLangItem(item: String) {
    this.myLangList.update(values => values.filter(l => l !== item));
  }
  addTheirLangItem() {
    const selectedLangs = this.selectTheirLangs.nativeElement;
    const newLang = selectedLangs.options[selectedLangs.selectedIndex].value;
    
    this.theirLangList.update(values => {
      
      if(values.find(v => v === newLang)){
        return[...values];
      }
      return [...values, newLang]
    })
  }
  removeTheirLangItem(item : String) {
    this.theirLangList.update(values => values.filter(l => l !== item));
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

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      initFlowbite();
    }
  }
}
