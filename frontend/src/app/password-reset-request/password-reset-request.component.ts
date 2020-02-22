import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';

import { UserService } from '../model/user.service';

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html'
})
export class PasswordResetRequestComponent implements OnInit {
  passwordResetRequestForm: FormGroup;
  formErrors: any;
  boolean = false;
  errorMessage = '';
  showConfirmation = false;
  submitted = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.passwordResetRequestForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, CustomValidators.email])]
    });
    this.passwordResetRequestForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  public onValueChanged(_data?: any) {
    if (!this.passwordResetRequestForm) {
      return;
    }
    const form = this.passwordResetRequestForm;
    for (const field of Object.keys(this.formErrors)) {
      // clear previous error message (if any)
      const control = form.get(field);
      if (control && control.dirty) {
        this.formErrors[field].valid = true;
        this.formErrors[field].message = '';
      }
    }
  }

  ngOnInit() {
    this.resetFormErrors();
    this.userService.logout();
  }

  public onSubmit(elementValues: any) {
    this.submitted = true;
    this.userService.passwordResetRequest(elementValues.email).subscribe(
      result => {
        if (result.success) {
          // show confirmation dialog
          this.showConfirmation = true;
        } else {
          this.errorMessage = 'Reset password is failed. Please check and try again.';
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

  private setFormErrors(errorFields: any): void {
    for (const key in errorFields) {
      // skip loop if the property is from prototype
      if (!errorFields.hasOwnProperty(key)) {
        continue;
      }

      const message = errorFields[key];
      this.formErrors[key].valid = false;
      this.formErrors[key].message = message;
    }
  }

  private resetFormErrors(): void {
    this.formErrors = {
      email: { valid: true, message: '' }
    };
  }

  isValid(field: string): boolean {
    let isValid = false;

    // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
    if (this.passwordResetRequestForm.controls[field].touched === false) {
      isValid = true;
    } else if (
      // If the field is touched and valid value, then it is considered as valid.
      this.passwordResetRequestForm.controls[field].touched === true &&
      this.passwordResetRequestForm.controls[field].valid === true
    ) {
      isValid = true;
    }
    return isValid;
  }
}
