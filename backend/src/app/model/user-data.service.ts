import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GlobalService } from './global.service';
import { User } from './user';
import { StaffService } from './staff.service';
import { ResponseBody } from './response-body';


@Injectable()
export class UserDataService {

  constructor(
      private globalService: GlobalService,
      private staffService: StaffService,
      private http: HttpClient
  ) {}


  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.staffService.getToken()
    });
  }

  public static getStatusTypes(): Array<any> {
    return [
      {
        label: 'Active',
        value: 10
      },
      {
        label: 'Disabled',
        value: 0
      }
    ];
  }

  // POST /v1/user
  addUser(user: User): Observable<any> {
    let headers = this.getHeaders();

    return this.http
               .post<ResponseBody>(
                   this.globalService.apiHost + '/user',
                   JSON.stringify(user),
                   {
                     headers: headers
                   }
               )
               .map((response) => {
                 return response;
               })
               .catch(this.handleError);
  }

  // DELETE /v1/user/1
  deleteUserById(id: number): Observable<any> {
    let headers = this.getHeaders();

    return this.http
               .delete<ResponseBody>(
                   this.globalService.apiHost + '/user/' + id,
                   {
                     headers: headers
                   }
               )
               .map((response) => {
                 return response;
               })
               .catch(this.handleError);
  }

  // PUT /v1/user/1
  updateUserById(user: User): Observable<any> {
    let headers = this.getHeaders();

    return this.http
               .put<ResponseBody>(
                   this.globalService.apiHost + '/user/' + user.id,
                   JSON.stringify(user),
                   {
                     headers: headers
        }
               )
               .map((response) => {
                 return response;
               })
               .catch(this.handleError);
  }

  // GET /v1/user
  getAllUsers(): Observable<User[]> {
    let headers = this.getHeaders();

    return this.http
               .get<ResponseBody>(
                   this.globalService.apiHost + '/user?sort=-id',
                   {
                     headers: headers
                   }
               )
               .map((response) => {
                 return <User[]>response.data;
               })
               .catch(this.handleError);
  }

  // GET /v1/user/1
  getUserById(id: number): Observable<User> {
    let headers = this.getHeaders();

    return this.http
               .get<ResponseBody>(
                   this.globalService.apiHost + '/user/' + id,
                   {
                     headers: headers
                   }
               )
               .map((response) => {
                 return <User>response.data;
               })
               .catch(this.handleError);
  }

  private handleError(response: any) {
    let errorMessage: any = {};
    // Connection error
    if (response.error.status === 0) {
      errorMessage = {
        success: false,
        status: 0,
        data: 'Sorry, there was a connection error occurred. Please try again.'
      };
    } else {
      errorMessage = response.error;
    }

    return Observable.throw(errorMessage);
  }

}
