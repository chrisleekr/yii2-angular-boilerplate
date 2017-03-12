import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {UserService} from '../model/user.service';
import {Router, ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent implements OnInit {
    private _passwordResetForm:FormGroup;
    private _formErrors:any;
    private _submitted:boolean = false;
    private _isTokenVerified:boolean = false;
    private _errorMessage:string = '';
    private _showConfirmation:boolean = false;

    private _token:string = '';

    constructor(private _userService:UserService,
                private _router:Router,
                private _activatedRoute:ActivatedRoute,
                private _formBuilder:FormBuilder) {

    }

    ngOnInit() {
        this._resetFormErrors();
        this._userService.logout();

        // subscribe to router event
        this._activatedRoute.queryParams.subscribe((params: Params) => {
            if(typeof params['token'] !== "undefined") {
                let token = params['token'];
                this.onPasswordResetTokenVerification(token);
            } else {
                this._errorMessage = "The parameters are missing. Please check your access";
            }

        });
    }

    private setupForm(){
        let password = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]));
        let passwordConfirm = new FormControl('', Validators.compose([Validators.required, CustomValidators.equalTo(password)]));

        this._passwordResetForm = this._formBuilder.group({
            password: password,
            password_confirm: passwordConfirm,
        });
        this._passwordResetForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    private onPasswordResetTokenVerification(token) {
        this._errorMessage = '';
        this._submitted = true;
        this._isTokenVerified = false;

        this._userService.passwordResetTokenVerification(token)
            .subscribe(
                result => {
                    if(result.success) {
                        // show confirmation
                        this._isTokenVerified = true;
                        this._token = token;

                        this.setupForm();

                    } else {
                        this._errorMessage = 'Password reset token is not valid. Please check and try again.';
                        this._isTokenVerified = false;
                    }
                    this._submitted = false;
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
                    this._isTokenVerified = false;

                }
            );

    }

    // Form related code

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
            username: {valid: true, message: ''},
            email: {valid: true, message: ''},
            password: {valid: true, message: ''},
            password_confirm: {valid: true, message: ''},
        };
    }

    private _isValid(field):boolean {
        let isValid:boolean = false;

        // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
        if(this._passwordResetForm.controls[field].touched == false) {
            isValid = true;
        }
        // If the field is touched and valid value, then it is considered as valid.
        else if(this._passwordResetForm.controls[field].touched == true && this._passwordResetForm.controls[field].valid == true) {
            isValid = true;
        }
        return isValid;
    }

    public onValueChanged(data?: any) {
        if (!this._passwordResetForm) { return; }
        const form = this._passwordResetForm;
        for (let field in this._formErrors) {
            // clear previous error message (if any)
            let control = form.get(field);
            if (control && control.dirty) {
                this._formErrors[field].valid = true;
                this._formErrors[field].message = '';
            }
        }
    }

    public onSubmit(elementValues: any) {
        this._submitted = true;
        this._userService.passwordReset(this._token, elementValues.password)
            .subscribe(
                result => {
                    if(result.success) {
                        // show confirmation dialog
                        this._showConfirmation = true;
                    } else {
                        this._errorMessage = 'Updating password is failed. Please check and try again.';
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
