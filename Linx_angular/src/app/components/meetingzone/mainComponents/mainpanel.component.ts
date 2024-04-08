import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SignalStorageService } from '../../../services/signal-storage.service';

@Component({
  selector: 'app-mainpanel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mainpanel.component.html',
  styleUrl: './mainpanel.component.css'
})
export class MainpanelComponent implements OnInit{

  private signalstoresvc : SignalStorageService = inject(SignalStorageService);
  public searchParams : {q : String, type : String} = {q : '', type : ''};

  async search(searchForm : NgForm){
    this.searchParams = {
      q: searchForm.value.q,
      type: searchForm.value.type
    };
  }

  ngOnInit(): void {
    let user = this.signalstoresvc.RetrieveUserData();
    console.log('USER RECUPERADO EN INICIO PANEL : ', user())
  }
}
