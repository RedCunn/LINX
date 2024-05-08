import { inject } from '@angular/core';
import { CanActivateFn} from '@angular/router';
import { SignalStorageService } from '../services/signal-storage.service';

export const mustloginGuard: CanActivateFn = () =>{
  if(inject(SignalStorageService).RetrieveJWT() !== null){
    return true;
  }else{
    return false;
  }
};
