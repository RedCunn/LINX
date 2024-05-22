import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-editaccount',
  standalone: true,
  imports: [],
  templateUrl: './editaccount.component.html',
  styleUrl: './editaccount.component.css'
})
export class EditaccountComponent {

  @Input() accountdata! : Object;

  public isChangePwd = signal(false);
  public isAuthenticated = signal(false);

  public newpwd : Object = {newpwd : '', repnewpwd : ''};

  toggleChangePwd() {
    this.isChangePwd.set(true);
  }


}
