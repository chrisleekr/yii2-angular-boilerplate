import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/Observable';

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
      private http: HttpClient
  ) {
    this.loggedIn = this.isLoggedIn();
  }

  public login(username, password) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    });

    return this.http
               .post<ResponseBody>(
                   this.globalService.apiHost + '/user/login',
                   JSON.stringify({
                     LoginForm: {
                       username: username,
                       password: password
                     }
                   }),
                   {
                     headers: headers
                   }
               )
               .map(response => {
                 if (response.success) {
                   localStorage.setItem(
                       environment.tokenName,
                       response.data.access_token
                   );
                   this.loggedIn = true;
                 } else {
                   localStorage.removeItem(environment.tokenName);
                   this.loggedIn = false;
                 }
                 return response;
               })
               .catch(this.handleError);
  }

  public signup(username, email, password) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    });

    return this.http
               .post<ResponseBody>(
                   this.globalService.apiHost + '/user/signup',
                   JSON.stringify({
                     SignupForm: {
                       username: username,
                       email: email,
                       password: password
                     }
                   }),
                   { headers: headers }
               )
               .map(response => {
                 if (response.success) {
                 } else {
                 }
                 return response;
               })
               .catch(this.handleError);
  }

  public signupConfirm(id, auth_key) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    });

    return this.http
               .post<ResponseBody>(
                   this.globalService.apiHost + '/user/confirm',
                   JSON.stringify({
                     SignupConfirmForm: {
                       id: id,
                       auth_key: auth_key
                     }
                   }),
                   { headers: headers }
               )
               .map(response => {
                 if (response.success) {
                 } else {
                 }
                 return response;
               })
               .catch(this.handleError);
  }

  public passwordResetRequest(email) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    });

    return this.http
               .post<ResponseBody>(
                   this.globalService.apiHost + '/user/password-reset-request',
                   JSON.stringify({
                     PasswordResetRequestForm: {
                       email: email
                     }
                   }),
                   { headers: headers }
               )
               .map(response => {
                 if (response.success) {
                 } else {
                 }
                 return response;
               })
               .catch(this.handleError);
  }

  public passwordResetTokenVerification(token) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    });

    return this.http
               .post<ResponseBody>(
                   this.globalService.apiHost + '/user/password-reset-token-verification',
                   JSON.stringify({
                     PasswordResetTokenVerificationForm: {
                       token: token
                     }
                   }),
                   { headers: headers }
               )
               .map(response => {
                 if (response.success) {
                 } else {
                 }
                 return response;
               })
               .catch(this.handleError);
  }

  public passwordReset(token, password) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    });

    return this.http
               .post<ResponseBody>(
                   this.globalService.apiHost + '/user/password-reset',
                   JSON.stringify({
                     PasswordResetForm: {
                       token: token,
                       password: password
                     }
                   }),
                   { headers: headers }
               )
               .map(response => {
                 if (response.success) {
                 } else {
                 }
                 return response;
               })
               .catch(this.handleError);
  }

  public logout(): void {
    localStorage.removeItem(environment.tokenName);
    this.loggedIn = false;
  }

  public getToken(): any {
    return localStorage.getItem(environment.tokenName);
  }

  public unauthorizedAccess(error: any): void {
    this.logout();
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    return this.jwtHelper.isTokenExpired() !== true;
  }

  public getJWTValue(): any {
    if (this.isLoggedIn()) {
      const token = this.getToken();
      return this.jwtHelper.decodeToken(token);
    } else {
      return null;
    }
  }

  private checkToken(): any {
    return !!localStorage.getItem(environment.tokenName);
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
