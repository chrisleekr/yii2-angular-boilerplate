import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';

import { Staff } from '../model/staff';
import { StaffDataService } from '../model/staff-data.service';
import { StaffService } from '../model/staff.service';

import _ from 'lodash';
import * as moment from 'moment';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './staff-form.component.html'
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

  constructor(
    private staffDataService: StaffDataService,
    private staffService: StaffService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    // Construct form group
    this.form = formBuilder.group(
      {
        username: [
          '',
          Validators.compose([
            Validators.required,
            CustomValidators.rangeLength([3, 15]),
            Validators.pattern('^[A-Za-z0-9_-]{3,15}$')
          ])
        ],
        email: ['', Validators.compose([Validators.required, CustomValidators.email])],
        password: ['', Validators.compose([Validators.minLength(6)])],
        confirmed_at: ['', Validators.compose([])],
        blocked_at: ['', Validators.compose([])],
        role: ['', Validators.compose([Validators.required])],
        // permissions: ['', Validators.compose([])],
        permissions: formBuilder.array([]),
        status: ['', Validators.compose([Validators.required])]
      },
      {
        validator: validateDateTime(['confirmed_at', 'blocked_at'])
      }
    );

    this.statusTypes = StaffDataService.getStatusTypes();
    this.roleTypes = StaffDataService.getRoleTypes();

    this.form.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  setFormErrors(errorFields: any): void {
    for (const key in errorFields) {
      // skip loop if the property is from prototype
      if (!errorFields.hasOwnProperty(key)) {
        continue;
      }

      this.formErrors[key].valid = false;
      this.formErrors[key].message = errorFields[key];
    }
  }

  setFormField(field: string, value: any) {
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
      status: { valid: true, message: '' }
    };
  }

  isValid(field: string): boolean {
    let isValid: boolean = false;

    // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
    if (this.form.controls[field].touched === false) {
      isValid = true;
    } else if (this.form.controls[field].touched === true && this.form.controls[field].valid === true) {
      // If the field is touched and valid value, then it is considered as valid.
      isValid = true;
    }
    return isValid;
  }

  onValueChanged(_data?: any) {
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

  ngOnInit() {
    this.resetFormErrors();
    this.resetStaff();

    // _route is activated route service. this.route.params is observable.
    // subscribe is method that takes function to retrieve parameters when it is changed.
    this.parameters = this.activatedRoute.params.subscribe(params => {
      // plus(+) is to convert 'id' to number
      if (typeof params['id'] !== 'undefined') {
        this.id = Number.parseInt(params['id'], 10);
        this.errorMessage = '';
        this.staffDataService.getStaffById(this.id).subscribe(
          staff => {
            this.staff = staff;
            this.setStaffToForm();
            this.mode = 'update';
          },
          error => {
            // unauthorized access
            if (error.status === 401 || error.status === 403) {
              this.staffService.unauthorizedAccess(error);
            } else {
              this.errorMessage = error.data.message;
            }
          }
        );
      } else {
        this.mode = 'create';

        this.staffDataService.getPermissionTypes().subscribe(
          result => {
            const permissions = result;
            if (permissions.length > 0) {
              permissions.forEach((_permission, index) => {
                permissions[index]['checked'] = true;
              });
            }

            this.staff.permissions = permissions;
            this.setStaffToForm();
          },
          error => {
            // unauthorized access
            if (error.status === 401 || error.status === 403) {
              this.staffService.unauthorizedAccess(error);
            } else {
              this.errorMessage = error.data.message;
            }
          }
        );
      }
    });
  }

  ngOnDestroy() {
    this.parameters.unsubscribe();
    this.staff = new Staff();
    this.setStaffToForm();
  }

  onSubmit() {
    this.submitted = true;
    this.resetFormErrors();

    this.setFormToStaff();

    if (this.mode === 'create') {
      this.staffDataService.addStaff(this.staff).subscribe(
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
          if (error.status === 422) {
            this.setFormErrors(JSON.parse(error.data.message));
          }
          // Unauthorized Access
          if (error.status === 401 || error.status === 403) {
            this.staffService.unauthorizedAccess(error);
          } else {
            // All other errors
            this.errorMessage = error.data.message;
          }
        }
      );
    } else if (this.mode === 'update') {
      this.staffDataService.updateStaffById(this.staff).subscribe(
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
          if (error.status === 422) {
            this.setFormErrors(JSON.parse(error.data.message));
          } else if (error.status === 401 || error.status === 403) {
            // Unauthorized Access
            this.staffService.unauthorizedAccess(error);
          } else {
            // All other errors
            this.errorMessage = error.data.message;
          }
        }
      );
    }
  }

  private setStaffToForm() {
    _.forIn(this.staff, (value: any, key: string) => {
      if (typeof this.form.controls[key] !== 'undefined') {
        if (key === 'permissions') {
          const formControls = value.map((v: any, k: string) => {
            return this.formBuilder.control(v.checked);
          });
          const formArray = this.formBuilder.array(formControls);
          this.form.setControl(key, formArray);
        } else if (key === 'confirmed_at' || key === 'blocked_at') {
          if (value === null || value === '') {
            this.form.controls[key].setValue(null);
          } else if (moment.isMoment(value)) {
            this.form.controls[key].setValue(value.format(environment.customDateTimeFormat.apiFormat));
          } else if (moment.unix(value).isValid()) {
            this.form.controls[key].setValue(new Date(moment.unix(value).format('YYYY-MM-DD HH:mm:ss')));
          } else {
            this.form.controls[key].setValue(null);
          }
        } else {
          this.form.controls[key].setValue(value);
        }
      }
    });
  }

  private setFormToStaff() {
    _.forIn(this.form.getRawValue(), (value: any, key: string) => {
      if (typeof this.staff[key] !== 'undefined') {
        if (key === 'permissions') {
          this.staff[key] = value.map((v: any, k: string) => {
            const newPermission = this.staff[key][k];
            newPermission.checked = v;
            return newPermission;
          });
        } else if (key === 'confirmed_at' || key === 'blocked_at') {
          if (moment.isMoment(value)) {
            this.staff[key] = String(value.unix());
          } else if (moment(value).isValid()) {
            this.staff[key] = String(moment(value).unix());
          } else {
            this.staff[key] = null;
          }
        } else {
          this.staff[key] = value;
        }
      }
    });
  }
}

function validateDateTime(fieldKeys: any) {
  return (group: FormGroup) => {
    for (const fieldKey of fieldKeys) {
      const field = group.controls[fieldKey];
      if (typeof field !== 'undefined' && field.value !== '' && field.value !== null) {
        if (moment(field.value, environment.customDateTimeFormat.parseInput, false).isValid() === false) {
          return field.setErrors({ validateDateTime: true });
        }
      }
    }
  };
}
