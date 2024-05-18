import { Component, OnInit, inject, signal } from '@angular/core';
import {Carousel, initCarousels, initFlowbite} from 'flowbite';
import { RestnodeService } from '../../services/restnode.service';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { IRestMessage } from '../../models/IRestMessage';
import { Router } from '@angular/router';
import { IAccount } from '../../models/useraccount/IAccount';

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
  public candidateProfiles! : IAccount[] | null ;

  public loading = signal(true);
  public currentIndex = signal(0);

  constructor(private router : Router) {
    let _userdata = this.signalStoreSvc.RetrieveUserData();
    if(_userdata() !== null){ 
      this.userdata = _userdata(); 
    }
  }

  async setCandidateProfiles (){
    try{
      const response : IRestMessage = await this.restsvc.shuffleCandidateProfiles( this.userdata?.userid!);
      if(response.code === 0){
        this.candidateProfiles = response.others as IAccount[];
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

  nextProfile(){
    if(this.currentIndex() < this.candidateProfiles?.length!-1){
      this.currentIndex.update((i) => i + 1); 
    }else{
      this.currentIndex.set(0);
    }
  
  }
  previousProfile(){
    if(this.currentIndex() > 0){
      this.currentIndex.update((i) => i - 1); 
    }else{
      this.currentIndex.set(this.candidateProfiles?.length!-1);
    }
  }

  async matchRequest(linxuserid : string){
    try {
      const res = await this.restsvc.requestMatch(this.userdata?.userid! , linxuserid);
      if(res.code === 0){
        console.log('RESPONSE MATCH REQ : ', res)
      }else{
        console.log('RESPONSE ERROR MATCH REQ : ', res)
      }
    } catch (error) {
      console.log('ERROR MATCH REQ : ', error)
    }
  }

 async ngOnInit(): Promise<void> {
    initCarousels();
    await this.setCandidateProfiles();
  }
}
