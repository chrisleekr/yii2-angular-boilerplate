import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';

import { UserService } from '../model/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent implements OnInit {
  passwordResetForm: FormGroup;
  formErrors: any;
  submitted = false;
  isTokenVerified = false;
  errorMessage = '';
  showConfirmation = false;

  token = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.resetFormErrors();
    this.userService.logout();

    // subscribe to router event
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (typeof params.token !== 'undefined') {
        const token = params.token;
        this.onPasswordResetTokenVerification(token);
      } else {
        this.errorMessage = 'The parameters are missing. Please check your access';
      }
    });
  }

  public onValueChanged(_data?: any) {
    if (!this.passwordResetForm) {
      return;
    }
    const form = this.passwordResetForm;
    for (const field of Object.keys(this.formErrors)) {
      // clear previous error message (if any)
      const control = form.get(field);
      if (control && control.dirty) {
        this.formErrors[field].valid = true;
        this.formErrors[field].message = '';
      }
    }
  }

  public onSubmit(elementValues: any) {
    this.submitted = true;
    this.userService.passwordReset(this.token, elementValues.password).subscribe(
      result => {
        if (result.success) {
          // show confirmation dialog
          this.showConfirmation = true;
        } else {
          this.errorMessage = 'Updating password is failed. Please check and try again.';
          this.submitted = false;
        }
      },
      error => {
        this.submitted = false;
        // Validation error
        if (error.status === 422) {
          this.resetFormErrors();
          // this.errorMessage = "There was an error on submission. Please check again.";
          const errorFields = JSON.parse(error.data.message);
          this.setFormErrors(errorFields);
        } else {
          this.errorMessage = error.data;
        }
      }
    );
  }

  private setupForm() {
    const password = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]));
    const passwordConfirm = new FormControl(
      '',
      Validators.compose([Validators.required, CustomValidators.equalTo(password)])
    );

    this.passwordResetForm = this.formBuilder.group({
      password,
      password_confirm: passwordConfirm
    });
    this.passwordResetForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  private onPasswordResetTokenVerification(token: string) {
    this.errorMessage = '';
    this.submitted = true;
    this.isTokenVerified = false;

    this.userService.passwordResetTokenVerification(token).subscribe(
      result => {
        if (result.success) {
          // show confirmation
          this.isTokenVerified = true;
          this.token = token;

          this.setupForm();
        } else {
          this.errorMessage = 'Password reset token is not valid. Please check and try again.';
          this.isTokenVerified = false;
        }
        this.submitted = false;
      },
      error => {
        if (typeof error.data.message !== 'undefined') {
          try {
            const message = JSON.parse(error.data.message);
            let errorMessage = '';

            for (const m of Object.keys(message)) {
              errorMessage += message[m] + '\n';
            }

            this.errorMessage = errorMessage;
          } catch (e) {
            this.errorMessage = error.data.message;
          }
        } else {
          this.errorMessage = error.data;
        }

        this.submitted = false;
        this.isTokenVerified = false;
      }
    );
  }

  private setFormErrors(errorFields: any): void {
    for (const key in errorFields) {
      // skip loop if the property is from prototype
      if (!errorFields.hasOwnProperty(key)) {
        continue;
      }

      const message = errorFields[key];
      if (this.formErrors[key]) {
        this.formErrors[key].valid = false;
        this.formErrors[key].message = message;
      } else {
        this.errorMessage = message;
      }
    }
  }

  private resetFormErrors(): void {
    this.formErrors = {
      username: { valid: true, message: '' },
      email: { valid: true, message: '' },
      password: { valid: true, message: '' },
      password_confirm: { valid: true, message: '' }
    };
  }

  isValid(field: string): boolean {
    let isValid = false;

    // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
    if (this.passwordResetForm.controls[field].touched === false) {
      isValid = true;
    } else if (
      // If the field is touched and valid value, then it is considered as valid.
      this.passwordResetForm.controls[field].touched === true &&
      this.passwordResetForm.controls[field].valid === true
    ) {
      isValid = true;
    }
    return isValid;
  }
}
