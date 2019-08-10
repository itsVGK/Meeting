import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/service/user-auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private userService: UserAuthService, private router: Router, private toastr: ToastrService) { }

  public firstName: String;
  public lastName: String;
  public email: String;
  public password: String;
  public mobile: String;

  ngOnInit() {
  }

  signinWithEmailPassword = () => {
    let newUser = {
      'firstName': this.firstName,
      'lastName': this.lastName,
      'email': this.email,
      'mobile': this.mobile,
      'password': this.password
    }

    this.userService.signupService(newUser).subscribe(
      (result) => {
        if (result.status === 200) {
          this.toastr.success("User Created Successfully", "Great");
          this.router.navigate(['login']);
        } else {
          this.toastr.error('Unable to create the user', 'Sorry!!');
          this.router.navigate(['signup']);
        }
      }
    )

  }
}
