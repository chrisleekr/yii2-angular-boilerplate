import { Injectable } from '@angular/core';

// tslint:disable-next-line: no-submodule-imports
import { HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class GlobalService {
  public apiHost: string;

  public setting: any = {};

  constructor(private jwtHelper: JwtHelperService) {
    this.apiHost = environment.apiHost;
  }

  static getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + GlobalService.getToken()
    });
  }

  static getToken(): any {
    return localStorage.getItem(environment.tokenName);
  }

  static handleError(response: Response | any) {
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

  isLoggedIn(): boolean {
    return this.jwtHelper.isTokenExpired() !== true;
  }

  loadGlobalSettingsFromSessionStorage(): void {
    if (sessionStorage.getItem('backend-setting') !== null) {
      this.setting = JSON.parse(sessionStorage.getItem('backend-setting'));
    }
  }
}
