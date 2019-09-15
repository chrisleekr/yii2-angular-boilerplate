import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { GlobalService } from './global.service';
import { ResponseBody } from './response-body';
import { Setting } from './setting';

@Injectable()
export class SettingDataService {
  constructor(private globalService: GlobalService, private http: HttpClient) {}

  public static getMetaTypes(): any {
    return [
      {
        label: 'Select',
        value: 'select'
      },
      {
        label: 'Number',
        value: 'number'
      },
      {
        label: 'Text',
        value: 'text'
      }
    ];
  }

  public static getIsPublicTypes(): any {
    return [
      {
        label: 'Public',
        value: 1
      },
      {
        label: 'Private',
        value: 0
      }
    ];
  }

  // POST /v1/setting
  addSetting(setting: Setting): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(this.globalService.apiHost + '/setting', JSON.stringify(setting), {
        headers
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // DELETE /v1/setting/1
  deleteSettingById(id: number): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .delete<ResponseBody>(this.globalService.apiHost + '/setting/' + id, {
        headers
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // PUT /v1/setting/1
  updateSettingById(setting: Setting): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .put<ResponseBody>(this.globalService.apiHost + '/setting/' + setting.id, JSON.stringify(setting), {
        headers
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // GET /v1/setting
  getAllSettings(): Observable<Setting[]> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/setting?sort=meta_key', {
        headers
      })
      .pipe(
        map(response => {
          return response.data as Setting[];
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  refreshGlobalSettings(): void {
    // get settings
    this.globalService.loadGlobalSettingsFromSessionStorage();

    this.getAllSettingsPublic().subscribe(settings => {
      settings.forEach(setting => {
        switch (setting.meta_type) {
          case 'select':
          case 'text':
            this.globalService.setting[setting.meta_key] = setting.meta_value;
            break;
          case 'number':
            this.globalService.setting[setting.meta_key] = +setting.meta_value;
            break;
        }
        sessionStorage.setItem('backend-setting', JSON.stringify(this.globalService.setting));
      });
    });
  }

  // GET /v1/setting/public
  getAllSettingsPublic(): Observable<any[]> {
    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/setting/public', {
        // headers
      })
      .pipe(
        map(response => {
          return response.data as any[];
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  getSettingById(id: number): Observable<Setting> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/setting/' + id, {
        headers
      })
      .pipe(
        map(response => {
          return response.data as Setting;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }
}
