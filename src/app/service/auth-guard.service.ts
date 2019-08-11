import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) {

  }

  canActivate() {
    if (sessionStorage.getItem('userId') != null)
      return true;
    this.router.navigate(['login'])
  }

}
