import { Component, OnInit, inject, signal } from '@angular/core';
import {Carousel, initCarousels, initFlowbite} from 'flowbite';
import { RestnodeService } from '../../services/restnode.service';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { IRestMessage } from '../../models/IRestMessage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-linxscarousel',
  standalone: true,
  imports: [],
  templateUrl: './linxscarousel.component.html',
  styleUrl: './linxscarousel.component.css'
})
export class LinxscarouselComponent implements OnInit{

  private restsvc  : RestnodeService = inject(RestnodeService);
  private signalStoreSvc : SignalStorageService = inject(SignalStorageService);
  
  public userdata! : IUser |null;
  public candidateProfiles! : IUser[] | null ;

  public loading = signal(true);
  public next = signal(false);

  constructor(private router : Router) {
    let _userdata = this.signalStoreSvc.RetrieveUserData();
    if(_userdata() !== null){ 
      this.userdata = _userdata(); 
    }
  }

  async setCandidateProfiles (){
    try{
      const response : IRestMessage = await this.restsvc.shuffleCandidateProfiles({userid : this.userdata?.userid!});
      console.log('RESRESRES _> ', response)
      if(response.code === 0){
        this.candidateProfiles = response.others;
        this.loading.set(false);
      }else{
        this.loading.set(false);
        this.router.navigateByUrl('/Linx/error');
      }
    }catch(error){
      this.loading.set(false);
      this.router.navigateByUrl('/Linx/error');
    }
  } 

  goNext(){
    this.next() ? this.next.set(false) : this.next.set(true);
  }

 async ngOnInit(): Promise<void> {
    initCarousels();
    await this.setCandidateProfiles();
  }
}
