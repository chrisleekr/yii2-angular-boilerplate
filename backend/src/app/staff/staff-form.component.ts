import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StaffDataService } from '../model/staff-data.service';
import { Staff } from '../model/staff';
import { StaffService } from '../model/staff.service';

import * as moment from 'moment';
import _ from 'lodash';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './staff-form.component.html',
})
export class StaffFormComponent implements OnInit, OnDestroy {
  mode = '';

  id: number;
  parameters: any;
  staff: Staff;

  errorMessage: string;

  form: FormGroup;
  formErrors: any;
  submitted: boolean = false;

  // Status Types
  statusTypes: any = {};

  // Roles
  roleTypes: any = {};

  constructor(private staffDataService: StaffDataService,
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
      role: ['', Validators.compose([
        Validators.required,
      ])],
      // permissions: ['', Validators.compose([])],
      permissions: formBuilder.array([]),
      status: ['', Validators.compose([
        Validators.required,
      ])],
    }, {
      validator: validateDateTime(['confirmed_at', 'blocked_at'])
    });

    this.statusTypes = StaffDataService.getStatusTypes();
    this.roleTypes = StaffDataService.getRoleTypes();

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
      permissions: { valid: true, message: '' },
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

  resetStaff() {
    this.staff = new Staff();
    this.staff.username = '';
    this.staff.email = '';
    this.staff.password = '';
    this.staff.confirmed_at = '';
    this.staff.blocked_at = '';
    this.staff.role = 50;
    this.staff.permissions = [];
    this.staff.status = 10;

    this.setStaffToForm();
  }

  private setStaffToForm() {
    _.forIn(this.staff, (value, key) => {
      if (typeof this.form.controls[key] !== 'undefined') {
        if (key === 'permissions') {
          const formControls = value.map((v, k) => {
            return this.formBuilder.control(v.checked);
          });
          const formArray = this.formBuilder.array(formControls);
          this.form.setControl(key, formArray);
        } else if (key === 'confirmed_at' || key === 'blocked_at') {

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

  private setFormToStaff() {
    _.forIn(this.form.getRawValue(), (value, key) => {
      if (typeof this.staff[key] !== 'undefined') {
        if (key === 'permissions') {
          this.staff[key] = value.map((v, k) => {
            const newPermission = this.staff[key][k];
            newPermission.checked = v;
            return newPermission;
          });
        } else if (key === 'confirmed_at' || key === 'blocked_at') {
          if (moment.isMoment(value)) {
            this.staff[key] = value.unix();
          } else if (moment(value).isValid()) {
            this.staff[key] = moment(value).unix()
          } else {
            this.staff[key] = null;
          }
        } else {
          this.staff[key] = value;
        }
      }
    });
  }

  public ngOnInit() {
    this.resetFormErrors();
    this.resetStaff();

    // _route is activated route service. this.route.params is observable.
    // subscribe is method that takes function to retrieve parameters when it is changed.
    this.parameters = this.activatedRoute.params.subscribe(params => {
      // plus(+) is to convert 'id' to number
      if (typeof params['id'] !== 'undefined') {
        this.id = Number.parseInt(params['id']);
        this.errorMessage = '';
        this.staffDataService.getStaffById(this.id)
            .subscribe(
                staff => {
                  this.staff = staff;
                  this.setStaffToForm();
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

        this.staffDataService.getPermissionTypes()
            .subscribe(
                result => {
                  let permissions = result;
                  if (permissions.length > 0) {
                    permissions.forEach((permission, index) => {
                      permissions[index]['checked'] = true;
                    });
                  }

                  this.staff.permissions = permissions;
                  this.setStaffToForm();
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
      }
    });
  }

  public ngOnDestroy() {
    this.parameters.unsubscribe();
    this.staff = new Staff();
    this.setStaffToForm();
  }

  public onSubmit() {
    this.submitted = true;
    this.resetFormErrors();

    this.setFormToStaff();

    if (this.mode == 'create') {
      this.staffDataService.addStaff(this.staff)
          .subscribe(
              result => {
                if (result.success) {
                  this.router.navigate(['/staff']);
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
                if (error.status == 401 || error.status == 403) {
                  this.staffService.unauthorizedAccess(error);
                }
                // All other errors
                else {
                  this.errorMessage = error.data.message;
                }
              }
          );
    } else if (this.mode == 'update') {
      this.staffDataService.updateStaffById(this.staff)
          .subscribe(
              result => {
                if (result.success) {
                  this.router.navigate(['/staff']);
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
