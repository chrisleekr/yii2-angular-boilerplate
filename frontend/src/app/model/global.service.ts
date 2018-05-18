import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable()
export class GlobalService {
  public apiHost: string;

  public setting: any = {};

  constructor() {
    this.apiHost = environment.apiHost;
  }

  loadGlobalSettingsFromSessionStorage(): void {
    if (sessionStorage.getItem('frontend-setting') != null) {
      this.setting = JSON.parse(sessionStorage.getItem('frontend-setting'));
    }
  }
}
