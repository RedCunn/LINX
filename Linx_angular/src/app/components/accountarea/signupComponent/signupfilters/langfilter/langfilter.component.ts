import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, signal } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';

@Component({
  selector: 'app-langfilter',
  standalone: true,
  imports: [],
  templateUrl: './langfilter.component.html',
  styleUrl: './langfilter.component.css'
})
export class LangfilterComponent implements OnInit{
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();
  @ViewChild('selectUserLangs') selectUserLangs !: ElementRef;
  @ViewChild('selectUserLangPrefs') selectUserLangPrefs !: ElementRef;
  public userLangList = signal<String[]>([]);
  public userLangPrefsList = signal<String[]>([]);

  ngOnInit(): void {
   if(this.userPreferences.language.mylanguages.length > 0){
    this.userLangList.set(this.userPreferences.language.mylanguages)
   } 
   if(this.userPreferences.language.theirlanguages.length > 0){
    this.userLangPrefsList.set(this.userPreferences.language.theirlanguages)
   }
  }

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
    this.userPreferencesChange.emit(this.userPreferences);
  }
  removeUserLang(item: String) {
    this.userLangList.update(values => values.filter(l => l !== item));
    this.userPreferences.language.mylanguages = this.userLangList();
    this.userPreferencesChange.emit(this.userPreferences);
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
    this.userPreferencesChange.emit(this.userPreferences);
  }
  removeUserLangPref(item : String) {
    this.userLangPrefsList.update(values => values.filter(l => l !== item));
    this.userPreferences.language.theirlanguages = this.userLangPrefsList();
    this.userPreferencesChange.emit(this.userPreferences);
  }


}
