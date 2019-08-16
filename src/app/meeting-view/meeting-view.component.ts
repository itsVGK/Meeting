import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { MeetingServiceService } from '../service/meeting-service.service';
import { all } from 'q';
import { ToastrService } from 'ngx-toastr';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-meeting-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './meeting-view.component.html',
  styleUrls: ['./meeting-view.component.scss']
})
export class MeetingViewComponent implements OnInit {

  public isAdmin: boolean = false;
  public events: CalendarEvent[] = [];
  public userForMeeting: String;

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  async getAllEvent(userForMeet) {
    let allEvents = await this.meetingService.getAllEvents(userForMeet);
    allEvents.subscribe(
      (result) => {
        if (result.status == 200) {
          for (let res of result.data) {
            res.start = new Date(res.start)
            res.end = new Date(res.end)
          }
          this.events = result.data;
        }
      }
    )
  }

  activeDayIsOpen: boolean = false;

  constructor(private toastr: ToastrService, private modal: NgbModal, private route: ActivatedRoute, private meetingService: MeetingServiceService) {
    this.userForMeeting = this.route.snapshot.paramMap.get('userId')
  }

  ngOnInit() {
    this.isAdmin = (sessionStorage.getItem('isAdmin') === 'true' ? true : false)
    this.getAllEvent(this.userForMeeting);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    let eve: any = {
      title: 'default',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
    }
    this.events = [
      ...this.events,
      eve
    ];
    console.log(this.events)
  }

  deleteEvent(eventToDelete: CalendarEvent): any {
    this.events = this.events.filter(event => event !== eventToDelete);
    this.meetingService.deleteEvent(eventToDelete).subscribe(
      (data) => {
        this.toastr.success('Meeting deleted successfully', 'Ok')
      }
    )
  }

  saveEvent(eventToSave: CalendarEvent): any {
    console.log(eventToSave)
    this.meetingService.saveEvent(eventToSave, this.userForMeeting).subscribe(
      (result) => {
        if (result.status === 200) {
          console.log('saved- sending mail ', result)
          this.getAllEvent(this.userForMeeting);
          this.meetingService.sendMail()
        }
      }
    );
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
