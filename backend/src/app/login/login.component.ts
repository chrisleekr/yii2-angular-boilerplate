import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StaffService } from '../model/staff.service';
// tslint:disable-next-line: ordered-imports
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formErrors: any;
  submitted: boolean = false;
  errorMessage: string = '';
  today: Date;

  constructor(private staffService: StaffService, private router: Router, private formBuilder: FormBuilder) {
    this.today = new Date();
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  setFormErrors(errorFields: any): void {
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

  resetFormErrors(): void {
    this.formErrors = {
      username: { valid: true, message: '' },
      password: { valid: true, message: '' }
    };
  }

  isValid(field: string): boolean {
    let isValid: boolean = false;

    // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
    if (this.loginForm.controls[field].touched === false) {
      isValid = true;
    } else if (this.loginForm.controls[field].touched === true && this.loginForm.controls[field].valid === true) {
      // If the field is touched and valid value, then it is considered as valid.
      isValid = true;
    }
    return isValid;
  }

  public onValueChanged(_data?: any) {
    if (!this.loginForm) {
      return;
    }
    const form = this.loginForm;
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
    this.staffService.logout();
  }

  public onSubmit(elementValues: any) {
    this.submitted = true;
    this.staffService.login(elementValues.username, elementValues.password).subscribe(
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
        if (error.status === 422) {
          this.resetFormErrors();
          // this.errorMessage = "There was an error on submission. Please check again.";
          this.setFormErrors(JSON.parse(error.data.message));
        } else {
          this.errorMessage = error.data;
        }
      }
    );
  }
}
