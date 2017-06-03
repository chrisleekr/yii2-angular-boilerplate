import {Component} from '@angular/core';
import {SettingDataService} from "./model/setting-data.service";

@Component({
    selector: 'body',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent {
    constructor(private _settingDataService: SettingDataService) {
        // get settings
        this._settingDataService.refreshGlobalSettings();

    }
}
