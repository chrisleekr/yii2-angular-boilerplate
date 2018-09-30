import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import swal from 'sweetalert2';

import {SettingDataService} from '../../model/setting-data.service';
import {Setting} from '../../model/setting';
import {StaffService} from '../../model/staff.service';

@Component({
    templateUrl: './setting-global-list.component.html',
})
export class SettingGlobalListComponent implements OnInit {
    settings: Setting[];
    errorMessage: string;

    constructor(private settingDataService: SettingDataService,
                private staffService: StaffService,
                private router: Router) {
    }

    ngOnInit() {
        this.getSettings();
    }

    public getSettings() {
        this.settings = null;
        this.settingDataService.getAllSettings()
            .subscribe(
                settings => {
                    this.settings = settings;
                },
                error => {
                    // unauthorized access
                    if (error.status === 401 || error.status === 403) {
                        this.staffService.unauthorizedAccess(error);
                    } else {
                        this.errorMessage = error.data.message;
                    }
                }
            );
    }

    public viewSetting(setting: Setting): void {
        this.router.navigate(['/setting', 'global', setting.id]);
    }

    public confirmDeleteSetting(setting: Setting): void {
        // Due to sweet alert scope issue, define as function variable and pass to swal

        const parent = this;
        this.errorMessage = '';

        swal({
            title: 'Are you sure?',
            text: 'Once delete, you won\'t be able to revert this!',
            type: 'question',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            preConfirm: function () {
                return new Promise(function (resolve, reject) {
                    parent.settingDataService.deleteSettingById(setting.id)
                        .subscribe(
                            result => {
                                parent.getSettings();
                                resolve();
                            },
                            error => {
                                // unauthorized access
                                if (error.status === 401 || error.status === 403) {
                                    parent.staffService.unauthorizedAccess(error);
                                } else {
                                    parent.errorMessage = error.data.message;
                                }
                                resolve();

                            }
                        );
                });
            }
        }).then(function (result) {
            // handle confirm, result is needed for modals with input

        }, function (dismiss) {
            // dismiss can be "cancel" | "close" | "outside"
        });
    }
}

