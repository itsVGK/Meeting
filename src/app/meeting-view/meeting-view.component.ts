import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { MeetingServiceService } from '../service/meeting-service.service';

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

  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fa fa-fw fa-pencil">ed</i>',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.handleEvent('Edited', event);
  //     }
  //   },
  //   {
  //     label: '<i class="fa fa-fw fa-times">de</i>',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.events = this.events.filter(iEvent => iEvent !== event);
  //       this.handleEvent('Deleted', event);
  //     }
  //   }
  // ];

  refresh: Subject<any> = new Subject();

  getAllEvent(userForMeet) {
    this.meetingService.getAllEvents(userForMeet).subscribe(
      (result) => {
        if (result.status == 200) {
          for (let res of result.data) {
            res.start = new Date(res.start)
            res.end = new Date(res.end)
          }
          this.events = result.data;
        } else {
        }
      }
    );
  }

  activeDayIsOpen: boolean = false;

  constructor(private modal: NgbModal, private route: ActivatedRoute, private meetingService: MeetingServiceService) {
    this.userForMeeting = this.route.snapshot.paramMap.get('userId')
    console.log(this.userForMeeting)
    this.getAllEvent(this.userForMeeting);
  }

  ngOnInit() {
    this.isAdmin = (sessionStorage.getItem('isAdmin') === 'true' ? true : false)
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
      title: '',
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

  }

  deleteEvent(eventToDelete: CalendarEvent): any {
    this.events = this.events.filter(event => event !== eventToDelete);
    this.meetingService.deleteEvent(eventToDelete).subscribe(
      (data) => {
        console.log('meeting deleted successfully', data)
      }
    )
  }

  saveEvent(eventToSave: CalendarEvent): any {
    console.log(eventToSave)
    this.meetingService.saveEvent(eventToSave, this.userForMeeting).subscribe(
      (result) => {
        if (result.status === 200) {
          console.log('saved', result)
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
