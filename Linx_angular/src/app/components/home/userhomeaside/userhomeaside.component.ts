import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { initFlowbite} from 'flowbite';
import { MatIcon } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-userhomeaside',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './userhomeaside.component.html',
  styleUrl: './userhomeaside.component.css'
})
export class UserhomeasideComponent implements OnInit{
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  }

}
