import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import swal, {SweetAlertOptions} from 'sweetalert2';

import {UserDataService} from "../model/user-data.service";
import {User} from "../model/user";
import {StaffService} from "../model/staff.service";

@Component({
    templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit{
    private _users:User[];
    private _errorMessage:string;

    constructor(private _userDataService:UserDataService,
                private _staffService:StaffService,
                private _router:Router) {}

    ngOnInit() {
        this.getUsers();
    }

    public getUsers() {
        this._users = null;
        this._userDataService.getAllUsers()
            .subscribe(
                users => {
                    this._users = users
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

    public viewUser(user:User):void {
        this._router.navigate(['/user', user.id]);
    }

    public confirmDeleteUser(user:User):void {
        // Due to sweet alert scope issue, define as function variable and pass to swal

        let parent = this;
        // let getUsers = this.getUsers;
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
                    parent._userDataService.deleteUserById(user.id)
                        .subscribe(
                            result => {
                                parent.getUsers();
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