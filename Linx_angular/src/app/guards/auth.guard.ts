import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { SignalStorageService } from '../services/signal-storage.service';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) =>{
  const authSvc = inject(AuthService);
  const router = inject(Router);
  
  if(!authSvc.isLoggedIn()){
    return router.parseUrl('/Linx/Login');
  }else{
    return true;
  }
};
