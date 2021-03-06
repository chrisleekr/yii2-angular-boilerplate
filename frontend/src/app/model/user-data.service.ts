import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { GlobalService } from './global.service';
import { User } from './user';
import { UserService } from './user.service';
import { ResponseBody } from './response-body';

@Injectable()
export class UserDataService {
  constructor(private globalService: GlobalService, private userService: UserService, private http: HttpClient) {}

  // GET /v1/user/me
  getMe(): Observable<User> {
    const headers = this.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/user/me', {
        headers
      })
      .pipe(
        map(response => {
          return response.data as User;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  updateUser(userData: User): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/me',
        JSON.stringify({
          UserEditForm: userData
        }),
        { headers }
      )
      .pipe(
        map(response => {
          if (response.success) {
          } else {
          }
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.userService.getToken()
    });
  }
}
