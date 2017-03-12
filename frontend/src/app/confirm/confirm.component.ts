import {Component, OnInit} from '@angular/core';
import {UserService} from '../model/user.service';
import {Router, ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
})
export class ConfirmComponent implements OnInit {
    private _submitted:boolean = false;
    private _errorMessage:string = '';
    private _isConfirmed:boolean = false;

    constructor(private _userService:UserService,
                private _router:Router,
                private _activatedRoute:ActivatedRoute) {

    }

    ngOnInit() {
        this._userService.logout();

        // subscribe to router event
        this._activatedRoute.queryParams.subscribe((params: Params) => {
            if(typeof params['id'] !== "undefined" && typeof params['auth_key'] !== "undefined") {
                let id = params['id'];
                let auth_key = params['auth_key'];
                this.onConfirm(id, auth_key);
            } else {
                this._errorMessage = "The parameters are missing. Please check your access";
            }

        });
    }

    private onConfirm(id, auth_key) {
        this._errorMessage = '';
        this._submitted = true;
        this._isConfirmed = false;

        this._userService.signupConfirm(id, auth_key)
            .subscribe(
                result => {
                    if(result.success) {
                        // show confirmation
                        this._isConfirmed = true;
                    } else {
                        this._errorMessage = 'Account confirmation is failed. Please check and try again.';
                        this._submitted = false;
                        this._isConfirmed = false;
                    }
                },
                error => {
                    if(typeof error.data.message !== "undefined") {
                        try{
                            let message = JSON.parse(error.data.message);
                            let errorMessage = '';

                            for (let m in message) {
                                errorMessage += message[m] + '\n';
                            }

                            this._errorMessage = errorMessage;

                        } catch(e) {
                            this._errorMessage = error.data.message;
                        }
                    } else {
                        this._errorMessage = error.data;
                    }

                    this._submitted = false;
                    this._isConfirmed = false;

                }
            );

    }
}
