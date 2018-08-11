import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GlobalService } from './global.service';
import { Staff } from './staff';
import { StaffService } from './staff.service';
import { ResponseBody } from './response-body';
import { StaffList } from './staff-list';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class StaffDataService {

  constructor(
      private globalService: GlobalService,
      private staffService: StaffService,
      private http: HttpClient
  ) {
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
    let headers = GlobalService.getHeaders();

    return this.http
               .post<ResponseBody>(
                   this.globalService.apiHost + '/staff',
                   JSON.stringify(staff),
                   { headers: headers }
               )
               .map(response => {
                 return response;
               })
               .catch(GlobalService.handleError);
  }

  // DELETE /v1/staff/1
  deleteStaffById(id: number): Observable<any> {
    let headers = GlobalService.getHeaders();

    return this.http
               .delete<ResponseBody>(
                   this.globalService.apiHost + '/staff/' + id,
                   { headers: headers }
               )
               .map(response => {
                 return response;
               })
               .catch(GlobalService.handleError);
  }

  // PUT /v1/staff/1
  updateStaffById(staff: Staff): Observable<any> {
    let headers = GlobalService.getHeaders();

    return this.http
               .put<ResponseBody>(
                   this.globalService.apiHost + '/staff/' + staff.id,
                   JSON.stringify(staff),
                   { headers: headers }
               )
               .map(response => {
                 return response;
               })
               .catch(GlobalService.handleError);
  }

  // GET /v1/staff
  getAllStaffs(extendedQueries?: any): Observable<StaffList> {
    let headers = GlobalService.getHeaders();

    let queries = {};
    if (extendedQueries) {
      queries = Object.assign(queries, extendedQueries);
    }

    return this.http
               .get<ResponseBody>(
                   this.globalService.apiHost + '/staff?'
                   + SharedService.serializeQueryString(queries),
                   {
                     headers: headers
                   }
               )
               .map(response => {
                 return new StaffList(response.data);
               })
               .catch(GlobalService.handleError);
  }

  // GET /v1/staff/1
  getStaffById(id: number): Observable<Staff> {
    let headers = GlobalService.getHeaders();

    return this.http
               .get<ResponseBody>(
                   this.globalService.apiHost + '/staff/' + id,
                   { headers: headers }
               )
               .map(response => {
                 return <Staff>response.data;
               })
               .catch(GlobalService.handleError);
  }

  public getPermissionTypes(): Observable<Array<any>> {
    let headers = GlobalService.getHeaders();

    return this.http
               .get<ResponseBody>(
                   this.globalService.apiHost + '/staff/get-permissions',
                   { headers: headers }
               )
               .map(response => {
                 return response.data;
               })
               .catch(GlobalService.handleError);
  }

}
