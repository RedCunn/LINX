import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSliderModule} from '@angular/material/slider';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatSliderModule],
  templateUrl: './signupFilters.component.html',
  styleUrl: './signupFilters.component.css'
})
export class SignupComponent implements OnInit{

  public signupForm:FormGroup;

  constructor(){
    this.signupForm = new FormGroup ({

    });
  }

  signup(){

  }
  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      initFlowbite();  
    }
  }
}
