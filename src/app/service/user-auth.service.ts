import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  public url = `http://localhost:3000/api/v1/users`;

  constructor(private http: HttpClient) { }

  public signupService(newUser): any {
    const params = new HttpParams()
      .set('firstName', newUser.firstName)
      .set('lastName', newUser.lastName)
      .set('email', newUser.email)
      .set('password', newUser.password)
      .set('userName', newUser.userName)
    return this.http.post(`${this.url}/signup`, params);
  }

  public loginService(email, pwd): any {
    const params = new HttpParams()
      .set('email', email)
      .set('password', pwd)
    return this.http.post(`${this.url}/login`, params)
  }

  public getSingleUser(userId): any {
    return this.http.get(`${this.url}/getSingleUser/${userId}`);
  }
}
