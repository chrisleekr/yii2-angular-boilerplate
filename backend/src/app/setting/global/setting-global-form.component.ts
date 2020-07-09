import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';

import { Setting } from '../../model/setting';
import { SettingDataService } from '../../model/setting-data.service';
import { StaffService } from '../../model/staff.service';

import _ from 'lodash';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: './setting-global-form.component.html'
})
export class SettingGlobalFormComponent implements OnInit, OnDestroy {
  mode = '';

  id: number;
  parameters: any;
  setting: Setting;

  metaTypes: any = {};
  isPublicTypes: any = {};
  selectedMetaType: string = '';
  enteredMetaAttributes: any = {};

  errorMessage: string;

  form: FormGroup;
  formErrors: any;
  submitted: boolean = false;

  constructor(
    private settingDataService: SettingDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private staffService: StaffService
  ) {
    this.form = formBuilder.group(
      {
        meta_key: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(100),
            // Checking value for alphanumeric and underscore
            Validators.pattern('^[a-zA-Z0-9_]*$')
          ])
        ],
        meta_name: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
        meta_type: ['', Validators.compose([Validators.required])],
        meta_desc: ['', Validators.compose([Validators.required, Validators.maxLength(1000)])],
        meta_attribute: [
          '',
          Validators.compose([
            // Checking value as JSON format
            CustomValidators.json
          ])
        ],
        meta_value: ['', Validators.compose([Validators.required])],
        is_public: ['', Validators.compose([Validators.required])]
      },
      {
        // Custom validator for multiple fields to check meta type, meta attribute and meta value
        validator: validateMetaValue('meta_type', 'meta_attribute', 'meta_value')
      }
    );

    this.metaTypes = SettingDataService.getMetaTypes();
    this.isPublicTypes = SettingDataService.getIsPublicTypes();

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

  resetFormErrors(): void {
    this.formErrors = {
      meta_key: { valid: true, message: '' },
      meta_name: { valid: true, message: '' },
      meta_type: { valid: true, message: '' },
      meta_desc: { valid: true, message: '' },
      meta_attribute: { valid: true, message: '' },
      meta_value: { valid: true, message: '' },
      is_public: { valid: true, message: '' }
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

  public onValueChanged(data?: any) {
    if (!this.form) {
      return;
    }

    const form = this.form;

    this.selectedMetaType = data.meta_type;

    if (data.meta_attribute !== '') {
      try {
        this.enteredMetaAttributes = JSON.parse(data.meta_attribute) || {};
      } catch (e) {
        // If exception is occurred, then meta attribute is not valid JSON
        this.enteredMetaAttributes = {};
      }
    }

    for (const field of Object.keys(this.formErrors)) {
      // clear previous error message (if any)
      const control = form.get(field);
      if (control && control.dirty) {
        this.formErrors[field].valid = true;
        this.formErrors[field].message = '';
      }
    }
  }

  resetSetting() {
    this.setting = new Setting();
    this.setting.meta_key = '';
    this.setting.meta_name = '';
    this.setting.meta_type = 'text';
    this.setting.meta_desc = '';
    this.setting.meta_attribute =
      '{"list":[{"value":"SAMPLE VALUE 1","label":"SAMPLE LABEL 1"}' +
      ',{"value":"SAMPLE VALUE 2","label":"SAMPLE LABEL 2"}]}';
    this.setting.meta_value = '';
    this.setting.is_public = 0;
  }

  public ngOnInit() {
    this.resetFormErrors();
    this.resetSetting();

    // _route is activated route service. this.route.params is observable.
    // subscribe is method that takes function to retrieve parameters when it is changed.
    this.parameters = this.activatedRoute.params.subscribe(params => {
      // plus(+) is to convert 'id' to number
      if (typeof params['id'] !== 'undefined') {
        this.id = Number.parseInt(params['id'], 10);
        this.errorMessage = '';
        this.settingDataService.getSettingById(this.id).subscribe(
          setting => {
            this.setting = setting;
            this.setSettingToForm();
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
      }
    });
  }

  public ngOnDestroy() {
    this.parameters.unsubscribe();
    this.setting = new Setting();
  }

  public onSubmit() {
    this.submitted = true;
    this.resetFormErrors();

    this.setFormToSetting();

    this.setting.meta_value += '';
    if (this.mode === 'create') {
      this.settingDataService.addSetting(this.setting).subscribe(
        result => {
          if (result.success) {
            this.settingDataService.refreshGlobalSettings();
            this.router.navigate(['/setting', 'global']);
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
    } else if (this.mode === 'update') {
      this.settingDataService.updateSettingById(this.setting).subscribe(
        result => {
          if (result.success) {
            this.settingDataService.refreshGlobalSettings();
            this.router.navigate(['/setting', 'global']);
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

  private setSettingToForm() {
    _.forIn(this.setting, (value: any, key: string) => {
      if (typeof this.form.controls[key] !== 'undefined') {
        this.form.controls[key].setValue(value);
      }
    });
  }

  private setFormToSetting() {
    _.forIn(this.form.getRawValue(), (value: any, key: string) => {
      if (typeof this.setting[key] !== 'undefined') {
        if (value instanceof moment) {
          this.setting[key] = moment(value, environment.customDateTimeFormat.parseInput, true).format(
            environment.customDateTimeFormat.apiFormat
          );
        } else {
          this.setting[key] = value;
        }
      }
    });
  }
}

function validateMetaValue(metaTypeKey: string, metaAttributeKey: string, metaValueKey: string) {
  return (group: FormGroup) => {
    const metaType = group.controls[metaTypeKey];
    const metaAttribute = group.controls[metaAttributeKey];
    const metaValue = group.controls[metaValueKey];

    let hasError: boolean = false;
    switch (metaType.value) {
      case 'select':
        let enteredMetaAttribute = {
          list: []
        };

        try {
          if (JSON.parse(metaAttribute.value)) {
            enteredMetaAttribute = JSON.parse(metaAttribute.value);
          }
        } catch (e) {
          // If exception is occurred, then meta attribute is not valid JSON
        }

        hasError = true;
        if (typeof enteredMetaAttribute.list !== 'undefined' && enteredMetaAttribute.list.length > 0) {
          for (const attribute of enteredMetaAttribute.list) {
            if (attribute['value'] + '' === metaValue.value + '') {
              hasError = false;
              break;
            }
          }
        }
        break;
      case 'text':
        // Allow free text
        hasError = false;
        break;
      case 'number':
        hasError = !/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(metaValue.value);
        break;
    }

    if (hasError === true) {
      return metaValue.setErrors({ validateMetaValue: true });
    }
  };
}
