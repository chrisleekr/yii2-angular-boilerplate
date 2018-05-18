import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GlobalService } from './global.service';
import { Setting } from './setting';
import { StaffService } from './staff.service';
import { ResponseBody } from './response-body';

@Injectable()
export class SettingDataService {
    constructor(
        private globalService: GlobalService,
        private staffService: StaffService,
        private http: HttpClient
    ) {
    }

  public static getMetaTypes(): Array<any> {
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

  public static getIsPublicTypes(): Array<any> {
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
    const headers = this.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/setting',
        JSON.stringify(setting),
        {
          headers: headers
        }
      )
      .map(response => {
        return response;
      })
      .catch(this.handleError);
  }

  // DELETE /v1/setting/1
  deleteSettingById(id: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .delete<ResponseBody>(this.globalService.apiHost + '/setting/' + id, {
        headers: headers
      })
      .map(response => {
        return response;
      })
      .catch(this.handleError);
  }

  // PUT /v1/setting/1
  updateSettingById(setting: Setting): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .put<ResponseBody>(
        this.globalService.apiHost + '/setting/' + setting.id,
        JSON.stringify(setting),
        {
          headers: headers
        }
      )
      .map(response => {
        return response;
      })
      .catch(this.handleError);
  }

  // GET /v1/setting
  getAllSettings(): Observable<Setting[]> {
    const headers = this.getHeaders();

    return this.http
      .get<ResponseBody>(
        this.globalService.apiHost + '/setting?sort=meta_key',
        {
          headers: headers
        }
      )
      .map(response => {
        return <Setting[]>response.data;
      })
      .catch(this.handleError);
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
        sessionStorage.setItem(
            'backend-setting',
          JSON.stringify(this.globalService.setting)
        );
      });
    });
  }

  // GET /v1/setting/public
  getAllSettingsPublic(): Observable<Array<any>> {
    const headers = this.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/setting/public', {
        // headers: headers
      })
      .map(response => {
        return <Array<any>>response.data;
      })
      .catch(this.handleError);
  }

  getSettingById(id: number): Observable<Setting> {
    const headers = this.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/setting/' + id, {
        headers: headers
      })
      .map(response => {
        return <Setting>response.data;
      })
      .catch(this.handleError);
  }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.staffService.getToken()
        });
    }

  private handleError(response: Response | any) {
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
