import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StaffService } from '../model/staff.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formErrors: any;
  submitted: boolean = false;
  errorMessage: string = '';
  today: Date;

  constructor(private staffService: StaffService,
      private router: Router,
      private formBuilder: FormBuilder) {

    this.today = new Date();
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
    this.loginForm.valueChanges
        .subscribe(data => this.onValueChanged(data));

  }

  setFormErrors(errorFields: any): void {
    for (let key in errorFields) {
      // skip loop if the property is from prototype
      if (!errorFields.hasOwnProperty(key)) continue;

      let message = errorFields[key];
      this.formErrors[key].valid = false;
      this.formErrors[key].message = message;
    }
  }

  resetFormErrors(): void {
    this.formErrors = {
      username: { valid: true, message: '' },
      password: { valid: true, message: '' },
    };
  }

  isValid(field): boolean {
    let isValid: boolean = false;

    // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
    if (this.loginForm.controls[field].touched == false) {
      isValid = true;
    }
    // If the field is touched and valid value, then it is considered as valid.
    else if (this.loginForm.controls[field].touched == true && this.loginForm.controls[field].valid == true) {
      isValid = true;
    }
    return isValid;
  }

  public onValueChanged(data?: any) {
    if (!this.loginForm) {
      return;
    }
    const form = this.loginForm;
    for (let field in this.formErrors) {
      // clear previous error message (if any)
      let control = form.get(field);
      if (control && control.dirty) {
        this.formErrors[field].valid = true;
        this.formErrors[field].message = '';
      }
    }
  }

  ngOnInit() {
    this.resetFormErrors();
    this.staffService.logout();
  }

  public onSubmit(elementValues: any) {
    this.submitted = true;
    this.staffService.login(elementValues.username, elementValues.password)
        .subscribe(
            result => {
              if (result.success) {
                this.router.navigate(['/dashboard']);
              } else {
                this.errorMessage = 'Username or password is incorrect.';
                this.submitted = false;
              }
            },
            error => {
              this.submitted = false;
              // Validation error
              if (error.status == 422) {
                this.resetFormErrors();
                // this.errorMessage = "There was an error on submission. Please check again.";
                let errorFields = JSON.parse(error.data.message);
                this.setFormErrors(errorFields);
              } else {
                this.errorMessage = error.data;
              }
            }
        );
  }
}
