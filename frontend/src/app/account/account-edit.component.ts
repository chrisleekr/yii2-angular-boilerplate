import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';

import { UserDataService } from '../model/user-data.service';
import { User } from '../model/user';
import { UserService } from '../model/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html'
})
export class AccountEditComponent implements OnInit {
  errorMessage: string;

  mode = '';
  user: User;
  originalEmail = '';
  form: FormGroup;
  formErrors: any;

  submitted = false;

  userData: any = {};

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    // Construct form group
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      password: ['', Validators.compose([Validators.minLength(6)])]
    });

    this.form.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  public onValueChanged(_data?: any) {
    if (!this.form) {
      return;
    }
    const form = this.form;
    for (const field of Object.keys(this.formErrors)) {
      // clear previous error message (if any)
      const control = form.get(field);
      if (control && control.dirty) {
        this.formErrors[field].valid = true;
        this.formErrors[field].message = '';
      }
    }
  }

  public ngOnInit() {
    this.resetFormErrors();
    this.resetUser();

    this.errorMessage = '';
    this.userDataService.getMe().subscribe(
      user => {
        this.user = user;

        this.form.controls.email.setValue(user.email);
        this.form.controls.password.setValue('');
        this.originalEmail = user.email;
        this.mode = 'update';
      },
      error => {
        // unauthorized access
        if (error.status === 401 || error.status === 403) {
          this.userService.unauthorizedAccess(error);
        } else {
          this.errorMessage = error.data.message;
        }
      }
    );
  }

  public onSubmit() {
    this.resetFormErrors();
    this.submitted = true;
    this.errorMessage = '';

    const tempUser = this.form.getRawValue();

    if (this.originalEmail !== tempUser.email) {
      const parent = this;

      Swal.fire({
        title: 'Are you sure?',
        html:
          'If you change your email address, you must confirm new email address again. ' +
          'You will not be able to access your account until you confirming new email address.' +
          '<br /><br  /><strong>New Email Address: ' +
          tempUser.email +
          '</strong><br /><br />You will be logged out. Please login again after confirming new email address.',
        icon: 'question',
        showLoaderOnConfirm: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!',
        preConfirm() {
          return new Promise(resolve => {
            parent.userDataService.updateUser(tempUser).subscribe(
              result => {
                if (result.success) {
                  parent.router.navigate(['/account']);
                } else {
                  parent.submitted = false;
                }
                resolve();
              },
              error => {
                if (error.status === 422) {
                  const errorFields = JSON.parse(error.data.message);
                  parent.setFormErrors(errorFields);
                } else if (error.status === 401 || error.status === 403) {
                  // unauthorized access
                  parent.userService.unauthorizedAccess(error);
                } else {
                  parent.errorMessage = error.data.message;
                }
                resolve();
              }
            );
          });
        }
      }).then(() => {
        // dismiss can be "cancel" | "close" | "outside"
        parent.submitted = false;
      });
    } else if (typeof tempUser.password !== 'undefined' && tempUser.password !== '') {
      this.userDataService.updateUser(tempUser).subscribe(
        result => {
          if (result.success) {
            this.router.navigate(['/account']);
          } else {
            this.submitted = false;
          }
        },
        error => {
          if (error.status === 422) {
            const errorFields = JSON.parse(error.data.message);
            this.setFormErrors(errorFields);
          } else if (error.status === 401 || error.status === 403) {
            // unauthorized access
            this.userService.unauthorizedAccess(error);
          } else {
            this.errorMessage = error.data.message;
          }
        }
      );
    } else {
      this.router.navigate(['/account']);
    }
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
      email: { valid: true, message: '' },
      password: { valid: true, message: '' }
    };
  }

  isValid(field: string): boolean {
    let isValid = false;

    // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
    if (this.form.controls[field].touched === false) {
      isValid = true;
    } else if (
      // If the field is touched and valid value, then it is considered as valid.
      this.form.controls[field].touched === true &&
      this.form.controls[field].valid === true
    ) {
      isValid = true;
    }

    return isValid;
  }

  private resetUser() {
    this.user = new User();
    this.user.email = '';
    this.user.password = '';
  }
}
