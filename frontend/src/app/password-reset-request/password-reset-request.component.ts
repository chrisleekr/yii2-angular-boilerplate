import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';

import {UserService} from '../model/user.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
})
export class PasswordResetRequestComponent implements OnInit {
    private _passwordResetRequestForm:FormGroup;
    private _formErrors:any;
    private _submitted:boolean = false;
    private _errorMessage:string = '';
    private _showConfirmation:boolean = false;

    constructor(private _userService:UserService,
                private _router:Router,
                private _formBuilder:FormBuilder) {


        this._passwordResetRequestForm = _formBuilder.group({
            email: ['', Validators.compose([Validators.required, CustomValidators.email])],
        });
        this._passwordResetRequestForm.valueChanges
            .subscribe(data => this.onValueChanged(data));

    }

    private _setFormErrors(errorFields:any):void{
        for (let key in errorFields) {
            // skip loop if the property is from prototype
            if (!errorFields.hasOwnProperty(key)) continue;

            let message = errorFields[key];
            this._formErrors[key].valid = false;
            this._formErrors[key].message = message;
        }
    }

    private _resetFormErrors():void{
        this._formErrors = {
            email: {valid: true, message: ''},
        };
    }

    private _isValid(field):boolean {
        let isValid:boolean = false;

        // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
        if(this._passwordResetRequestForm.controls[field].touched == false) {
            isValid = true;
        }
        // If the field is touched and valid value, then it is considered as valid.
        else if(this._passwordResetRequestForm.controls[field].touched == true && this._passwordResetRequestForm.controls[field].valid == true) {
            isValid = true;
        }
        return isValid;
    }

    public onValueChanged(data?: any) {
        if (!this._passwordResetRequestForm) { return; }
        const form = this._passwordResetRequestForm;
        for (let field in this._formErrors) {
            // clear previous error message (if any)
            let control = form.get(field);
            if (control && control.dirty) {
                this._formErrors[field].valid = true;
                this._formErrors[field].message = '';
            }
        }
    }

    ngOnInit() {
        this._resetFormErrors();
        this._userService.logout();
    }

    public onSubmit(elementValues: any) {
        this._submitted = true;
        this._userService.passwordResetRequest(elementValues.email)
            .subscribe(
                result => {
                    if(result.success) {
                        // show confirmation dialog
                        this._showConfirmation = true;
                    } else {
                        this._errorMessage = 'Reset password is failed. Please check and try again.';
                        this._submitted = false;
                    }
                },
                error => {
                    this._submitted = false;
                    // Validation error
                    if(error.status == 422) {
                        this._resetFormErrors();
                        // this._errorMessage = "There was an error on submission. Please check again.";
                        let errorFields = JSON.parse(error.data.message);
                        this._setFormErrors(errorFields);
                    } else {
                        this._errorMessage = error.data;
                    }
                }
            );
    }
}
