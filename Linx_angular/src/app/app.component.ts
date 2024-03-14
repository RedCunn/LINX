import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MainheaderComponent } from './components/meetingzone/mainComponents/mainheader/mainheader.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MainheaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'Linx_angular';

  
}
