import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeetingServiceService {

  constructor(private http: HttpClient) { }

  public url = `http://localhost:3000/api/v1/meet`;

  saveEvent = (eve): any => {
    let params = new HttpParams()
      .set('userId', sessionStorage.getItem('userId'))
      .set('title', eve.title)
      .set('start', eve.start)
      .set('end', eve.end)
      .set('colorP', eve.color.primary)
      .set('colorS', eve.color.secondary)
      .set('draggable', eve.draggable)
      .set('rbstart', eve.resizable.beforeStart)
      .set('raend', eve.resizable.afterEnd)
      .set('createdBy', sessionStorage.getItem('userId'))
      .set('meetingId', eve.meetingId)
    return this.http.post(`${this.url}/save`, params);
  }

  getAllEvents = (userId): any => {
    return this.http.get(`${this.url}/getAllEvent/byUser/${userId}`)
  }

  deleteEvent = (event): any => {
    return this.http.delete(`${this.url}/delete/meet/${event.meetingId}`)
  }

}
