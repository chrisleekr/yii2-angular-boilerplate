import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import swal, {SweetAlertOptions} from 'sweetalert2';

import {SettingDataService} from "../../model/setting-data.service";
import {Setting} from "../../model/setting";
import {StaffService} from "../../model/staff.service";

@Component({
    templateUrl: './setting-global-list.component.html',
})
export class SettingGlobalListComponent implements OnInit{
    private _settings:Setting[];
    private _errorMessage:string;

    constructor(private _settingDataService:SettingDataService,
                private _staffService:StaffService,
                private _router:Router) {}

    ngOnInit() {
        this.getSettings();
    }

    public getSettings() {
        this._settings = null;
        this._settingDataService.getAllSettings()
            .subscribe(
                settings => {
                    this._settings = settings
                },
                error =>  {
                    // unauthorized access
                    if(error.status == 401 || error.status == 403) {
                        this._staffService.unauthorizedAccess(error);
                    } else {
                        this._errorMessage = error.data.message;
                    }
                }
            );
    }

    public viewSetting(setting:Setting):void {
        this._router.navigate(['/setting', 'global', setting.id]);
    }


    public confirmDeleteSetting(setting:Setting):void {
        // Due to sweet alert scope issue, define as function variable and pass to swal

        let parent = this;
        this._errorMessage = '';

        swal({
            title: 'Are you sure?',
            text: "Once delete, you won't be able to revert this!",
            type: 'question',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            preConfirm: function () {
                return new Promise(function (resolve, reject) {
                    parent._settingDataService.deleteSettingById(setting.id)
                        .subscribe(
                            result => {
                                parent.getSettings();
                                resolve();
                            },
                            error =>  {
                                // unauthorized access
                                if(error.status == 401 || error.status == 403) {
                                    parent._staffService.unauthorizedAccess(error);
                                } else {
                                    parent._errorMessage = error.data.message;
                                }
                                resolve();

                            }
                        );
                })
            }
        }).then(function(result) {
            // handle confirm, result is needed for modals with input

        }, function(dismiss) {
            // dismiss can be "cancel" | "close" | "outside"
        });
    }
}

