import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meeting-view',
  templateUrl: './meeting-view.component.html',
  styleUrls: ['./meeting-view.component.scss']
})
export class MeetingViewComponent implements OnInit {

  public dates:Array<any>=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  public rows:Array<any>=[1,2,3];
  constructor() { }

  ngOnInit() {
  }

  onCell(val){
    console.log(val)
  }
}
