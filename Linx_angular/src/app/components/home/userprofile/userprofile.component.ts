import { Component, signal } from '@angular/core';
import { IUser } from '../../../models/userprofile/IUser';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css'
})
export class UserprofileComponent {

  public isPreference = signal(false);
  public isProfile = signal(false);
  public isAccount = signal(true);
  public isChangePwd = signal(false);
  public isAuthenticated = signal(false);


  //#region PREFERENCES EDITION___________________________________


  //#endregion

  //#region PROFILE EDITION________________________________________

  private _onChange: Function = (_value: { year: number, month: number, day: number }) => { }
  private _onTouch: Function = (_value: { year: number, month: number, day: number }) => { }

  days: number[] = [];
  months: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  years: number[] = Array.from({ length: 100 }, (el, pos) => (new Date(Date.now()).getFullYear() - 16) - pos);

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

  //#endregion

  selectSection(event: any) {
    const { value, name } = event.target;

    switch (value) {
      case 'preferences':
        this.isChangePwd.set(false);
        this.isAccount.set(false);
        this.isProfile.set(false);
        this.isPreference.set(true)
        break;
      case 'account':
        this.isPreference.set(false);
        this.isProfile.set(false);
        this.isAccount.set(true)
        break;
      case 'profile':
        this.isChangePwd.set(false);
        this.isAccount.set(false);
        this.isPreference.set(false);
        this.isProfile.set(true)
        break;
      default:
        break;
    }
  }

  changePwd() {
    this.isChangePwd.set(true);
  }
}
