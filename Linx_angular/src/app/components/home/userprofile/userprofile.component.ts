import { Component, signal } from '@angular/core';
import { IUser } from '../../../models/userprofile/IUser';
import {EditaccountComponent} from './editAccount/editaccount.component'

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [EditaccountComponent],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css'
})
export class UserprofileComponent {

  public isPreference = signal(false);
  public isProfile = signal(false);
  public isAccount = signal(true);
  
  public accountdata : Object = {linxname : '', email : '', name : '', lastname : ''};

  

  selectSection(event: any) {
    const { value, name } = event.target;

    switch (value) {
      case 'preferences':
        this.isAccount.set(false);
        this.isPreference.set(true)
        break;
      case 'account':
        this.isPreference.set(false);
        this.isAccount.set(true)
        break;
      default:
        break;
    }
  }

}
