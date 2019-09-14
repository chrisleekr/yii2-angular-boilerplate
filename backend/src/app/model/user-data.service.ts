import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SharedService } from '../shared/shared.service';
import { GlobalService } from './global.service';
import { ResponseBody } from './response-body';
import { StaffService } from './staff.service';
import { User } from './user';
import { UserList } from './user-list';

@Injectable()
export class UserDataService {
  constructor(private globalService: GlobalService, private staffService: StaffService, private http: HttpClient) {}

  public static getStatusTypes(): any[] {
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
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(this.globalService.apiHost + '/user', JSON.stringify(user), {
        headers
      })
      .map(response => {
        return response;
      })
      .catch(GlobalService.handleError);
  }

  // DELETE /v1/user/1
  deleteUserById(id: number): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .delete<ResponseBody>(this.globalService.apiHost + '/user/' + id, {
        headers
      })
      .map(response => {
        return response;
      })
      .catch(GlobalService.handleError);
  }

  // PUT /v1/user/1
  updateUserById(user: User): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .put<ResponseBody>(this.globalService.apiHost + '/user/' + user.id, JSON.stringify(user), {
        headers
      })
      .map(response => {
        return response;
      })
      .catch(GlobalService.handleError);
  }

  // GET /v1/user
  getAllUsers(extendedQueries?: any): Observable<UserList> {
    const headers = GlobalService.getHeaders();

    let queries = {};
    if (extendedQueries) {
      queries = {...queries, ...extendedQueries};
    }

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/user?' + SharedService.serializeQueryString(queries), {
        headers
      })
      .map(response => {
        return new UserList(response.data);
      })
      .catch(GlobalService.handleError);
  }

  // GET /v1/user/1
  getUserById(id: number): Observable<User> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/user/' + id, {
        headers
      })
      .map(response => {
        return response.data as User;
      })
      .catch(GlobalService.handleError);
  }
}
