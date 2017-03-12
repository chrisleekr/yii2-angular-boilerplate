import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {CustomValidators} from 'ng2-validation';
import {ContainsValidators} from "../shared/contains-validator.directive";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";


import {UserDataService} from "../model/user-data.service";
import {User} from "../model/user";
import {UserService} from "../model/user.service";

import * as moment from "moment";

@Component({
    templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit, OnDestroy{
    private _mode = '';

    private _id:number;
    private _parameters:any;
    private _user:User;

    private _errorMessage:string;

    private _form:FormGroup;
    private _formErrors:any;
    private _submitted:boolean = false;

    private _statusTypes:any = {};


    constructor(private _userDataService:UserDataService,
                private _userService:UserService,
                private _router:Router,
                private _activatedRoute:ActivatedRoute,
                private _formBuilder:FormBuilder) {

        // Construct form group
        this._form = _formBuilder.group({
            username: ['', Validators.compose([
                Validators.required,
                CustomValidators.rangeLength([3, 15]),
                Validators.pattern('^[A-Za-z0-9_-]{3,15}$'),
            ])],
            email: ['', Validators.compose([
                Validators.required,
                CustomValidators.email,
            ])],
            password: ['', Validators.compose([
                Validators.minLength(6)
            ])],
            confirmed_at: ['', Validators.compose([])],
            blocked_at: ['', Validators.compose([])],
            status: ['', Validators.compose([
                Validators.required,
                // Custom validator for checking value against list of values
                ContainsValidators.contains(['10','0'])
            ])],
        }, {
            validator: validateDateTime(['confirmed_at', 'blocked_at'])
        });

        this._statusTypes = UserDataService.getStatusTypes();

        this._form.valueChanges
            .subscribe(data => this.onValueChanged(data));

    }

    private _setFormErrors(errorFields:any):void{
        for (let key in errorFields) {
            let errorField = errorFields[key];
            // skip loop if the property is from prototype
            if (!this._formErrors.hasOwnProperty(errorField.field)) continue;

            // let message = errorFields[error.field];
            this._formErrors[errorField.field].valid = false;
            this._formErrors[errorField.field].message = errorField.message;
        }
    }

    private _resetFormErrors():void{
        this._formErrors = {
            username: {valid: true, message: ''},
            email: {valid: true, message: ''},
            password: {valid: true, message: ''},
            confirmed_at: {valid: true, message: ''},
            blocked_at: {valid: true, message: ''},
            status: {valid: true, message: ''},
        };
    }

    private _isValid(field):boolean {
        let isValid:boolean = false;

        // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
        if(this._form.controls[field].touched == false) {
            isValid = true;
        }
        // If the field is touched and valid value, then it is considered as valid.
        else if(this._form.controls[field].touched == true && this._form.controls[field].valid == true) {
            isValid = true;
        }
        return isValid;
    }

    public onValueChanged(data?: any) {
        if (!this._form) { return; }
        const form = this._form;
        for (let field in this._formErrors) {
            // clear previous error message (if any)
            let control = form.get(field);
            if (control && control.dirty) {
                this._formErrors[field].valid = true;
                this._formErrors[field].message = '';
            }
        }
    }

    private _resetUser(){
        this._user = new User();
        this._user.username = '';
        this._user.email = '';
        this._user.password = '';
        this._user.confirmed_at = '';
        this._user.blocked_at = '';
        this._user.status = 10;
    }

    public ngOnInit() {
        this._resetFormErrors();
        this._resetUser();


        // _route is activated route service. this._route.params is observable.
        // subscribe is method that takes function to retrieve parameters when it is changed.
        this._parameters = this._activatedRoute.params.subscribe(params => {
            // plus(+) is to convert 'id' to number
            if(typeof params['id'] !== "undefined") {
                this._id = Number.parseInt(params['id']);
                this._errorMessage = "";
                this._userDataService.getUserById(this._id)
                    .subscribe(
                        user => {
                            this._user = user;
                            this._mode = 'update';
                        },
                        error => {
                            // unauthorized access
                            if(error.status == 401) {
                                this._userService.unauthorizedAccess(error);
                            } else {
                                this._errorMessage = error.data.message;
                            }
                        }
                    );
            } else {
                this._mode = 'create';

            }
        });
    }

    public ngOnDestroy() {
        this._parameters.unsubscribe();
        this._user = new User();
    }

    public onSubmit() {
        this._submitted = true;
        this._resetFormErrors();
        if(this._mode == 'create') {
            this._userDataService.addUser(this._user)
                .subscribe(
                    result => {
                        if(result.success) {
                            this._router.navigate(['/user']);
                        } else {
                            this._submitted = false;
                        }
                    },
                    error => {
                        this._submitted = false;
                        // Validation errors
                        if(error.status == 422) {
                            this._setFormErrors(error.data);
                        }
                        // Unauthorized Access
                        else if(error.status == 401) {
                            this._userService.unauthorizedAccess(error);
                        }
                        // All other errors
                        else {
                            this._errorMessage = error.data.message;
                        }
                    }
                );
        } else if(this._mode == 'update') {
            this._userDataService.updateUserById(this._user)
                .subscribe(
                    result => {
                        if(result.success) {
                            this._router.navigate(['/user']);
                        } else {
                            this._submitted = false;
                        }
                    },
                    error => {
                        this._submitted = false;
                        // Validation errors
                        if(error.status == 422) {
                            this._setFormErrors(error.data);
                        }
                        // Unauthorized Access
                        else if(error.status == 401) {
                            this._userService.unauthorizedAccess(error);
                        }
                        // All other errors
                        else {
                            this._errorMessage = error.data.message;
                        }
                    }
                );
        }
    }
}

function validateDateTime(fieldKeys:any){
    return (group: FormGroup) => {
        for(let i = 0; i < fieldKeys.length; i++) {
            let field = group.controls[fieldKeys[i]];
            if(typeof field !== "undefined" && (field.value != "" && field.value != null)) {
                if(moment(field.value, "YYYY-MM-DD HH:mm:ss", true).isValid() == false) {
                    return field.setErrors({validateDateTime: true});
                }
            }
        }
    }
}