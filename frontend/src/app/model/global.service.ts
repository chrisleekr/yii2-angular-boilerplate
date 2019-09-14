import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable()
export class GlobalService {
  public apiHost: string;

  public setting: any = {};

  constructor() {
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

  static handleError(response: any) {
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

  loadGlobalSettingsFromSessionStorage(): void {
    if (sessionStorage.getItem('frontend-setting') != null) {
      this.setting = JSON.parse(sessionStorage.getItem('frontend-setting'));
    }
  }
}
