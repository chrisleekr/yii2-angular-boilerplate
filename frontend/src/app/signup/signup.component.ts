import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { UserService } from '../model/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  formErrors: any;
  submitted = false;
  errorMessage = '';
  showConfirmation = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    const password = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]));
    const passwordConfirm = new FormControl(
      '',
      Validators.compose([Validators.required, CustomValidators.equalTo(password)])
    );

    this.signupForm = this.formBuilder.group({
      username: [
        '',
        Validators.compose([
          Validators.required,
          CustomValidators.rangeLength([3, 25]),
          Validators.pattern('^[A-Za-z0-9_-]{3,25}$')
        ])
      ],
      email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      password,
      password_confirm: passwordConfirm // use standalone variable to use equalTo
    });

    this.signupForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  public onValueChanged(data?: any) {
    if (!this.signupForm) {
      return;
    }
    const form = this.signupForm;
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
    this.userService.signup(elementValues.username, elementValues.email, elementValues.password).subscribe(
      result => {
        if (result.success) {
          // show confirmation dialog
          this.showConfirmation = true;
        } else {
          this.errorMessage = 'Registration is failed. Please check and try again.';
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
      username: { valid: true, message: '' },
      email: { valid: true, message: '' },
      password: { valid: true, message: '' },
      password_confirm: { valid: true, message: '' }
    };
  }

  isValid(field: string): boolean {
    let isValid = false;

    // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
    if (this.signupForm.controls[field].touched === false) {
      isValid = true;
    } else if (
      // If the field is touched and valid value, then it is considered as valid.
      this.signupForm.controls[field].touched === true &&
      this.signupForm.controls[field].valid === true
    ) {
      isValid = true;
    }
    return isValid;
  }
}
