import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, signal } from '@angular/core';
import { IUser } from '../../../../../models/userprofile/IUser';

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
  @ViewChild('selectUserLangs') selectUserLangs !: ElementRef;
  @ViewChild('selectUserLangPrefs') selectUserLangPrefs !: ElementRef;
  public userLangList = signal<string[]>([]);
  public userLangPrefsList = signal<string[]>([]);

  ngOnInit(): void {
   if(this.userProfile.languages.length > 0){
    this.userLangList.set(this.userProfile.languages)
   } 
   if(this.userProfile.preferences.languages.length > 0){
    this.userLangPrefsList.set(this.userProfile.preferences.languages)
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

    this.userProfile.preferences.languages = this.userLangPrefsList();
    this.userProfileChange.emit(this.userProfile);
  }
  removeUserLangPref(item : String) {
    this.userLangPrefsList.update(values => values.filter(l => l !== item));
    this.userProfile.preferences.languages = this.userLangPrefsList();
    this.userProfileChange.emit(this.userProfile);
  }


}
