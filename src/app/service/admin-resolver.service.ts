import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminResolverService implements Resolve<any>{
  public isAdmin: boolean = false;

  constructor(private userAuth: UserAuthService) { }

  resolve() {
    let result = this.userAuth.getSingleUser(sessionStorage.getItem('userId'));
    result.subscribe((data) => {
      let userName = data.data.userName;
      if (userName.startsWith('admin'))
        this.isAdmin = true;;
    })
    return this.isAdmin;
  }
}
