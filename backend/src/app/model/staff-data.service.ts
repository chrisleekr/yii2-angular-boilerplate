import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GlobalService } from './global.service';
import { Staff } from './staff';
import { StaffService } from './staff.service';
import { ResponseBody } from './response-body';
import { throwError } from 'rxjs/internal/observable/throwError';
import { SharedService } from '../shared/shared.service';
import { StaffList } from './staff-list';

@Injectable()
export class StaffDataService {

  constructor(
      private globalService: GlobalService,
      private staffService: StaffService,
      private http: HttpClient
  ) {
  }

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
        label: 'Waiting Confirmation',
        value: 1
      },
      {
        label: 'Disabled',
        value: 0
      }
    ];
  }

  public static getRoleTypes(): Array<any> {
    return [
      {
        label: 'Administrator',
        value: 99
      },
      {
        label: 'Staff',
        value: 50
      }
    ];
  }

  // POST /v1/staff
  addStaff(staff: Staff): Observable<any> {
    let headers = this.getHeaders();

    return this.http
               .post<ResponseBody>(
                   this.getURLList(),
                   JSON.stringify(staff),
                   { headers: headers }
               )
               .map(response => {
                 return response;
               })
               .catch(this.handleError);
  }

  // DELETE /v1/staff/1
  deleteStaffById(id: number): Observable<any> {
    let headers = this.getHeaders();

    return this.http
               .delete<ResponseBody>(
                   this.getURLList() + '/' + id,
                   { headers: headers }
               )
               .map(response => {
                 return response;
               })
               .catch(this.handleError);
  }

  // PUT /v1/staff/1
  updateStaffById(staff: Staff): Observable<any> {
    let headers = this.getHeaders();

    return this.http
               .put<ResponseBody>(
                   this.getURLList() + '/' + staff.id,
                   JSON.stringify(staff),
                   { headers: headers }
               )
               .map(response => {
                 return response;
               })
               .catch(this.handleError);
  }

  // GET /v1/staff
  getAllStaffs(extendedQueries?: any): Observable<StaffList> {
    let headers = this.getHeaders();

    let queries = {
      'sort': '-id'
    };
    if (extendedQueries) {
      queries = Object.assign(queries, extendedQueries);
    }

    let url = this.getURLList() + '?' + SharedService.serializeQueryString(queries);

    return this.http
               .get<ResponseBody>(
                   url,
                   { headers: headers }
               )
               .map(response => {
                 return new StaffList(response.data);
               })
               .catch(this.handleError);
  }

  // GET /v1/staff/1
  getStaffById(id: number): Observable<Staff> {
    let headers = this.getHeaders();

    return this.http
               .get<ResponseBody>(
                   this.getURLList() + '/' + id,
                   { headers: headers }
               )
               .map(response => {
                 return <Staff>response.data;
               })
               .catch(this.handleError);
  }

  public getPermissionTypes(): Observable<Array<any>> {
    let headers = this.getHeaders();

    return this.http
               .get<ResponseBody>(
                   this.getURLList() + '/get-permissions',
                   { headers: headers }
               )
               .map(response => {
                 return response.data;
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

    return throwError(errorMessage);
  }

  private getURLList() {
    return this.globalService.apiHost + '/staff';
  }

}
