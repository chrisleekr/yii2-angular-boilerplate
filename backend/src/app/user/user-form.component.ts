import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserDataService } from '../model/user-data.service';
import { User } from '../model/user';
import { StaffService } from '../model/staff.service';

import * as moment from 'moment';
import _ from 'lodash';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit, OnDestroy {
  mode: string = '';

  id: number;
  parameters: any;
  user: User;

  errorMessage: string;

  form: FormGroup;
  formErrors: any;
  submitted: boolean = false;

  // Status Types
  statusTypes: any = {};

  constructor(private userDataService: UserDataService,
      private staffService: StaffService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private formBuilder: FormBuilder) {

    // Construct form group
    this.form = formBuilder.group({
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
      ])],
    }, {
      validator: validateDateTime(['confirmed_at', 'blocked_at'])
    });

    this.statusTypes = UserDataService.getStatusTypes();

    this.form.valueChanges
        .subscribe(data => this.onValueChanged(data));

  }

  setFormErrors(errorFields: any): void {
    for (let key in errorFields) {
      let errorField = errorFields[key];
      // skip loop if the property is from prototype
      if (!this.formErrors.hasOwnProperty(key)) continue;

      // let message = errorFields[error.field];
      this.formErrors[key].valid = false;
      this.formErrors[key].message = errorField;
    }
  }

  setFormField(field, value) {
    this.form.controls[field].setValue(value);
  }

  resetFormErrors(): void {
    this.formErrors = {
      username: { valid: true, message: '' },
      email: { valid: true, message: '' },
      password: { valid: true, message: '' },
      confirmed_at: { valid: true, message: '' },
      blocked_at: { valid: true, message: '' },
      role: { valid: true, message: '' },
      status: { valid: true, message: '' },
    };
  }

  isValid(field): boolean {
    let isValid: boolean = false;

    // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
    if (this.form.controls[field].touched == false) {
      isValid = true;
    }
    // If the field is touched and valid value, then it is considered as valid.
    else if (this.form.controls[field].touched == true && this.form.controls[field].valid == true) {
      isValid = true;
    }

    return isValid;
  }

  public onValueChanged(data?: any) {
    if (!this.form) {
      return;
    }
    const form = this.form;
    for (let field in this.formErrors) {
      // clear previous error message (if any)
      let control = form.get(field);
      if (control && control.dirty) {
        this.formErrors[field].valid = true;
        this.formErrors[field].message = '';
      }
    }
  }

  resetUser() {
    this.user = new User();
    this.user.username = '';
    this.user.email = '';
    this.user.password = '';
    this.user.confirmed_at = '';
    this.user.blocked_at = '';
    this.user.status = 10;

    this.setUserToForm();
  }

  private setUserToForm() {
    _.forIn(this.user, (value, key) => {
      if (typeof this.form.controls[key] !== 'undefined') {
        if (key === 'confirmed_at' || key === 'blocked_at') {
          if (moment.isMoment(value)) {
            this.form.controls[key].setValue(value.format(environment.customDateTimeFormat.apiFormat));
          } else if (moment(value).isValid()) {
            this.form.controls[key].setValue(moment(value).format(environment.customDateTimeFormat.apiFormat))
          } else {
            this.form.controls[key].setValue('');
          }

          this.form.controls[key].setValue(value !== null && value !== '' ? moment.unix(value).format(environment.customDateTimeFormat.apiFormat) : '');
        } else {
          this.form.controls[key].setValue(value);
        }
      }
    });
  }

  private setFormToUser() {
    _.forIn(this.form.getRawValue(), (value, key) => {
      if (typeof this.user[key] !== 'undefined') {
        if (key === 'confirmed_at' || key === 'blocked_at') {
          if (moment.isMoment(value)) {
            this.user[key] = value.unix();
          } else if (moment(value).isValid()) {
            this.user[key] = moment(value).unix()
          } else {
            this.user[key] = null;
          }
        } else {
          this.user[key] = value;
        }
      }
    });
  }

  public ngOnInit() {
    this.resetFormErrors();
    this.resetUser();

    // _route is activated route service. this.route.params is observable.
    // subscribe is method that takes function to retrieve parameters when it is changed.
    this.parameters = this.activatedRoute.params.subscribe(params => {
      // plus(+) is to convert 'id' to number
      if (typeof params['id'] !== 'undefined') {
        this.id = Number.parseInt(params['id']);
        this.errorMessage = '';
        this.userDataService.getUserById(this.id)
            .subscribe(
                user => {
                  this.user = user;
                  this.setUserToForm();
                  this.mode = 'update';
                },
                error => {
                  // unauthorized access
                  if (error.status == 401 || error.status == 403) {
                    this.staffService.unauthorizedAccess(error);
                  } else {
                    this.errorMessage = error.data.message;
                  }
                }
            );
      } else {
        this.mode = 'create';

      }
    });
  }

  public ngOnDestroy() {
    this.parameters.unsubscribe();
    this.user = new User();
  }

  public onSubmit() {
    this.submitted = true;
    this.resetFormErrors();

    this.setFormToUser();

    if (this.mode == 'create') {
      this.userDataService.addUser(this.user)
          .subscribe(
              result => {
                if (result.success) {
                  this.router.navigate(['/user']);
                } else {
                  this.submitted = false;
                }
              },
              error => {
                this.submitted = false;
                // Validation errors
                if (error.status == 422) {
                  let errorFields = JSON.parse(error.data.message);
                  this.setFormErrors(errorFields);
                }
                // Unauthorized Access
                else if (error.status == 401 || error.status == 403) {
                  this.staffService.unauthorizedAccess(error);
                }
                // All other errors
                else {
                  this.errorMessage = error.data.message;
                }
              }
          );
    } else if (this.mode == 'update') {
      this.userDataService.updateUserById(this.user)
          .subscribe(
              result => {
                if (result.success) {
                  this.router.navigate(['/user']);
                } else {
                  this.submitted = false;
                }
              },
              error => {
                this.submitted = false;
                // Validation errors
                if (error.status == 422) {
                  let errorFields = JSON.parse(error.data.message);
                  this.setFormErrors(errorFields);
                  //this.setFormErrors(error.data);
                }
                // Unauthorized Access
                else if (error.status == 401 || error.status == 403) {
                  this.staffService.unauthorizedAccess(error);
                }
                // All other errors
                else {
                  this.errorMessage = error.data.message;
                }
              }
          );
    }
  }
}

function validateDateTime(fieldKeys: any) {
  return (group: FormGroup) => {
    for (let i = 0; i < fieldKeys.length; i++) {
      let field = group.controls[fieldKeys[i]];
      if (typeof field !== 'undefined' && (field.value != '' && field.value != null)) {
        if (moment(field.value, environment.customDateTimeFormat.parseInput, false).isValid() == false) {
          return field.setErrors({ validateDateTime: true });
        }
      }
    }
  }
}
