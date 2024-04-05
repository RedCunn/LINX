import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-mainpanel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mainpanel.component.html',
  styleUrl: './mainpanel.component.css'
})
export class MainpanelComponent {

  public searchParams : {q : String, type : String} = {q : '', type : ''};

  async search(searchForm : NgForm){
    this.searchParams = {
      q: searchForm.value.q,
      type: searchForm.value.type
    };
  }

}
