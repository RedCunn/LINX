import { Component, Input, OnInit, Output, EventEmitter, signal, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { initFlowbite } from 'flowbite';
import { IFiltering } from '../../../../models/userprofile/filteringProfile';
import { RestnodeService } from '../../../../services/restnode.service';
import {AgefilterComponent} from './agefilter/agefilter.component';
import { GenderfilterComponent } from './genderfilter/genderfilter.component';
import { BeliefsfilterComponent } from './beliefsfilter/beliefsfilter.component';
import { PoliticsfilterComponent } from './politicsfilter/politicsfilter.component';
import { DietfilterComponent } from './dietfilter/dietfilter.component';
import { LangfilterComponent } from './langfilter/langfilter.component';
import { WorkfilterComponent } from './workfilter/workfilter.component';
import { ProxyfilterComponent } from './proxyfilter/proxyfilter.component';

@Component({
  selector: 'app-signup-Filters',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatNativeDateModule, MatIconModule,
            AgefilterComponent, 
            GenderfilterComponent,
            BeliefsfilterComponent,
            PoliticsfilterComponent,
            DietfilterComponent,
            LangfilterComponent,
            WorkfilterComponent,
            ProxyfilterComponent
          ],
  templateUrl: './signupFilters.component.html',
  styleUrl: './signupFilters.component.css'
})
export class SignupFiltersComponent implements OnInit {

  private restnodeSvc : RestnodeService = inject(RestnodeService);
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();
 
  public sectionPag = signal(0);
  


  nextPag(){
    this.sectionPag.update((value)=>{
      if(value < 8){
        return value + 1
      }else{
        return value
      }
      
    } );
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

  onUserPreferencesChange(newPres : IFiltering){

  }

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      initFlowbite();
    }
  }
}
