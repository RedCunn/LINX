import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';

@Component({
  selector: 'app-langfilter',
  standalone: true,
  imports: [],
  templateUrl: './langfilter.component.html',
  styleUrl: './langfilter.component.css'
})
export class LangfilterComponent {
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();
  @ViewChild('selectUserLangs') selectUserLangs !: ElementRef;
  @ViewChild('selectUserLangPrefs') selectUserLangPrefs !: ElementRef;
  public userLangList = signal<String[]>([]);
  public userLangPrefsList = signal<String[]>([]);

  addUserLang(event : any) {
    const selectedLangs = this.selectUserLangs.nativeElement;
    const newLang = selectedLangs.options[selectedLangs.selectedIndex].value;
    
    this.userLangList.update(values => {
      
      if(values.find(v => v === newLang)){
        return[...values];
      }
      return [...values, newLang]
    })

    this.userPreferences.language.mylanguages = this.userLangList();
  }
  removeUserLang(item: String) {
    this.userLangList.update(values => values.filter(l => l !== item));
    this.userPreferences.language.mylanguages = this.userLangList();
  }
  addUserLangPref() {
    const selectedLangs = this.selectUserLangPrefs.nativeElement;
    const newLang = selectedLangs.options[selectedLangs.selectedIndex].value;
    
    this.userLangPrefsList.update(values => {
      
      if(values.find(v => v === newLang)){
        return[...values];
      }
      return [...values, newLang]
    })

    this.userPreferences.language.theirlanguages = this.userLangPrefsList();
  }
  removeUserLangPref(item : String) {
    this.userLangPrefsList.update(values => values.filter(l => l !== item));
    this.userPreferences.language.theirlanguages = this.userLangPrefsList();
  }


}
