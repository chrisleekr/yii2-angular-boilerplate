import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { map, catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

import { environment } from './../../environments/environment';
import { GlobalService } from './global.service';
import { ResponseBody } from './response-body';

@Injectable()
export class UserService {
  redirectURL = '';
  loggedIn = false;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private http: HttpClient,
    @Inject(LOCAL_STORAGE) private localStorage: any
  ) {
    this.loggedIn = this.isLoggedIn();
  }

  public login(username: string, password: string) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/login',
        JSON.stringify({
          LoginForm: {
            username,
            password
          }
        }),
        {
          headers
        }
      )
      .pipe(
        map(response => {
          if (response.success) {
            this.localStorage.setItem(environment.tokenName, response.data.access_token);
            this.loggedIn = true;
          } else {
            this.localStorage.removeItem(environment.tokenName);
            this.loggedIn = false;
          }
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  public signup(username: string, email: string, password: string) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/signup',
        JSON.stringify({
          SignupForm: {
            username,
            email,
            password
          }
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

  public signupConfirm(id: number, authKey: string) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/confirm',
        JSON.stringify({
          SignupConfirmForm: {
            id,
            auth_key: authKey
          }
        }),
        { headers }
      )
      .pipe(
        map(response => {
          if (response.success) {
            // do something here
          } else {
            // do something else here
          }
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  public passwordResetRequest(email: string) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/password-reset-request',
        JSON.stringify({
          PasswordResetRequestForm: {
            email
          }
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

  public passwordResetTokenVerification(token: string) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/password-reset-token-verification',
        JSON.stringify({
          PasswordResetTokenVerificationForm: {
            token
          }
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

  public passwordReset(token: string, password: string) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/password-reset',
        JSON.stringify({
          PasswordResetForm: {
            token,
            password
          }
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

  public logout(): void {
    this.localStorage.removeItem(environment.tokenName);
    this.loggedIn = false;
  }

  public getToken(): any {
    return this.localStorage.getItem(environment.tokenName) || '';
  }

  public unauthorizedAccess(_error: any): void {
    this.logout();
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    return this.jwtHelper.isTokenExpired(this.getToken()) !== true;
  }

  public getJWTValue(): any {
    if (this.isLoggedIn()) {
      const token = this.getToken();
      return this.jwtHelper.decodeToken(token);
    } else {
      return null;
    }
  }
}
