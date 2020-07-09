// tslint:disable-next-line: no-submodule-imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SharedService } from '../shared/shared.service';
import { GlobalService } from './global.service';
import { ResponseBody } from './response-body';
import { Staff } from './staff';
import { StaffList } from './staff-list';

@Injectable()
export class StaffDataService {
  constructor(private globalService: GlobalService, private http: HttpClient) {}

  public static getStatusTypes(): any[] {
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

  public static getRoleTypes(): any[] {
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
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(this.globalService.apiHost + '/staff', JSON.stringify(staff), { headers })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // DELETE /v1/staff/1
  deleteStaffById(id: number): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .delete<ResponseBody>(this.globalService.apiHost + '/staff/' + id, { headers })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // PUT /v1/staff/1
  updateStaffById(staff: Staff): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .put<ResponseBody>(this.globalService.apiHost + '/staff/' + staff.id, JSON.stringify(staff), { headers })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // GET /v1/staff
  getAllStaffs(extendedQueries?: any): Observable<StaffList> {
    const headers = GlobalService.getHeaders();

    let queries = {};
    if (extendedQueries) {
      queries = { ...queries, ...extendedQueries };
    }

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/staff?' + SharedService.serializeQueryString(queries), {
        headers
      })
      .pipe(
        map(response => {
          return new StaffList(response.data);
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // GET /v1/staff/1
  getStaffById(id: number): Observable<Staff> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/staff/' + id, { headers })
      .pipe(
        map(response => {
          return response.data as Staff;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  public getPermissionTypes(): Observable<any[]> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/staff/get-permissions', { headers })
      .pipe(
        map(response => {
          return response.data;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }
}
