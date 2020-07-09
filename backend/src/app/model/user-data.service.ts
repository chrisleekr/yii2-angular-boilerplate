import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { SharedService } from '../shared/shared.service';
import { GlobalService } from './global.service';
import { ResponseBody } from './response-body';
import { User } from './user';
import { UserList } from './user-list';

@Injectable()
export class UserDataService {
  constructor(private globalService: GlobalService, private http: HttpClient) {}

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
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // DELETE /v1/user/1
  deleteUserById(id: number): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .delete<ResponseBody>(this.globalService.apiHost + '/user/' + id, {
        headers
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // PUT /v1/user/1
  updateUserById(user: User): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .put<ResponseBody>(this.globalService.apiHost + '/user/' + user.id, JSON.stringify(user), {
        headers
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // GET /v1/user
  getAllUsers(extendedQueries?: any): Observable<UserList> {
    const headers = GlobalService.getHeaders();

    let queries = {
      per_page: 10
    };
    if (extendedQueries) {
      queries = { ...queries, ...extendedQueries };
    }

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/user?' + SharedService.serializeQueryString(queries), {
        headers
      })
      .pipe(
        map(response => {
          return new UserList(response.data);
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // GET /v1/user/1
  getUserById(id: number): Observable<User> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/user/' + id, {
        headers
      })
      .pipe(
        map(response => {
          return response.data as User;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }
}
