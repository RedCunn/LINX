import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, signal } from '@angular/core';
import { IFiltering } from '../../../../../models/userprofile/filteringProfile';
import { IUser } from '../../../../../models/userprofile/user';

@Component({
  selector: 'app-langfilter',
  standalone: true,
  imports: [],
  templateUrl: './langfilter.component.html',
  styleUrl: './langfilter.component.css'
})
export class LangfilterComponent implements OnInit{
  
  @Input() userProfile! : IUser;
  @Output() userProfileChange = new EventEmitter<IUser>();
  @Input() userPreferences !: IFiltering;
  @Output() userPreferencesChange = new EventEmitter<IFiltering>();
  @ViewChild('selectUserLangs') selectUserLangs !: ElementRef;
  @ViewChild('selectUserLangPrefs') selectUserLangPrefs !: ElementRef;
  public userLangList = signal<String[]>([]);
  public userLangPrefsList = signal<String[]>([]);

  ngOnInit(): void {
   if(this.userProfile.languages.length > 0){
    this.userLangList.set(this.userProfile.languages)
   } 
   if(this.userPreferences.languages.length > 0){
    this.userLangPrefsList.set(this.userPreferences.languages)
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

    this.userProfile.languages = this.userLangList();
    this.userProfileChange.emit(this.userProfile);
  }
  removeUserLang(item: String) {
    this.userLangList.update(values => values.filter(l => l !== item));
    this.userProfile.languages = this.userLangList();
    this.userProfileChange.emit(this.userProfile);
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

    this.userPreferences.languages = this.userLangPrefsList();
    this.userPreferencesChange.emit(this.userPreferences);
  }
  removeUserLangPref(item : String) {
    this.userLangPrefsList.update(values => values.filter(l => l !== item));
    this.userPreferences.languages = this.userLangPrefsList();
    this.userPreferencesChange.emit(this.userPreferences);
  }


}
