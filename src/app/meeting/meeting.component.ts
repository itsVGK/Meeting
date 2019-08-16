import { Component, OnInit } from '@angular/core';
import { MeetingServiceService } from '../service/meeting-service.service';
import { Router } from '@angular/router';
import { UserAuthService } from '../service/user-auth.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {

  public loggedUser: String = sessionStorage.getItem('userId')
  constructor(private meetingSerice: MeetingServiceService, private router: Router, private userService: UserAuthService) {
    this.getAllUsersList();
  }

  ngOnInit() {

  }

  public userList: any;

  getAllUsersList() {
    this.userService.getAllUsersList().subscribe(
      (result) => {
        this.userList = result.data
      }
    )
  }

  gotoMeet = (user) => {
    this.router.navigate(['meeting', user.userId])
  }

}
