import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/service/user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private userAuthService: UserAuthService, private toastr: ToastrService, private router: Router) { }

  public email: String;
  public password: String;

  ngOnInit() {
    if (sessionStorage.getItem('userId') != null)
      this.router.navigate(['meeting'])
  }

  loginWithEmailPassword() {
    this.userAuthService.loginService(this.email, this.password).subscribe(
      (result) => {
        if (result.status == 200) {
          this.toastr.success("User Logged In Successfully", "Great");
          this.router.navigate(['meeting']);
          sessionStorage.setItem('userId', result.data.userId);
        } else {
          this.toastr.error('Unable to Login', 'Sorry!!');
          this.router.navigate(['login']);
        }
      }
    )
  }
}
