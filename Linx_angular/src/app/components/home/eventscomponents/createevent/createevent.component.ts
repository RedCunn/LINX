import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-createevent',
  standalone: true,
  imports: [MatDatepickerModule, MatInputModule, MatFormFieldModule],
  templateUrl: './createevent.component.html',
  styleUrl: './createevent.component.css',
  providers : [provideNativeDateAdapter()]
})
export class CreateeventComponent {

  @ViewChild('selectEventTags') selectEventTags !: ElementRef;
  public eventTags = signal<String[]>([]);


  constructor(private router : Router, private location : Location){}

  goToEventsPanel(){
    this.location.back();
  }

  removeEventTag(item: String) {
    this.eventTags.update(values => values.filter(l => l !== item));
  }
  addEventTag() {
    const selectedTags = this.selectEventTags.nativeElement;
    const newTag = selectedTags.options[selectedTags.selectedIndex].value;
    
    this.eventTags.update(values => {
      
      if(values.find(v => v === newTag)){
        return[...values];
      }
      return [...values, newTag]
    })

  }
}
