import { Component, OnInit, signal } from '@angular/core';
import {Carousel, initCarousels, initFlowbite} from 'flowbite';

@Component({
  selector: 'app-linxscarousel',
  standalone: true,
  imports: [],
  templateUrl: './linxscarousel.component.html',
  styleUrl: './linxscarousel.component.css'
})
export class LinxscarouselComponent implements OnInit{
  
  public next = signal(false);

  goNext(){
    this.next() ? this.next.set(false) : this.next.set(true);
  }
  ngOnInit(): void {
    initCarousels();
  }
}
