import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {CustomValidators} from 'ng2-validation';


import {SettingDataService} from "../../model/setting-data.service";
import {Setting} from "../../model/setting";
import {StaffService} from "../../model/staff.service";
import {GlobalService} from "../../model/global.service";
import {ContainsValidators} from "../../shared/contains-validator.directive";

@Component({
    templateUrl: './setting-global-form.component.html',
})
export class SettingGlobalFormComponent implements OnInit, OnDestroy{
    private _mode = '';

    private _id:number;
    private _parameters:any;
    private _setting:Setting;


    private _metaTypes:any = {};
    private _isPublicTypes:any = {};
    private _selectedMetaType:string = '';
    private _enteredMetaAttributes:any = {};

    private _errorMessage:string;

    private _form:FormGroup;
    private _formErrors:any;
    private _submitted:boolean = false;


    constructor(private _settingDataService:SettingDataService,
                private _globalService:GlobalService,
                private _router:Router,
                private _activatedRoute:ActivatedRoute,
                private _formBuilder:FormBuilder,
                private _staffService:StaffService) {

        this._form = _formBuilder.group({
            meta_key: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(100),
                // Checking value for alphanumeric and underscore
                Validators.pattern('^[a-zA-Z0-9_]*$')
            ])],
            meta_name: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(200)
            ])],
            meta_type: ['', Validators.compose([
                Validators.required,
                // Custom validator for checking value against list of values
                ContainsValidators.contains('value', SettingDataService.getMetaTypes())
            ])],
            meta_desc: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(1000)
            ])],
            meta_attribute: ['', Validators.compose([
                // Checking value as JSON format
                CustomValidators.json
            ])],
            meta_value: ['', Validators.compose([
                Validators.required
            ])],
            is_public: ['', Validators.compose([
                Validators.required,
                // Custom validator for checking value against list of values
                ContainsValidators.contains('value', SettingDataService.getIsPublicTypes())
            ])],
        },{
            // Custom validator for multiple fields to check meta type, meta attribute and meta value
            validator: validateMetaValue('meta_type', 'meta_attribute', 'meta_value')
        });

        this._metaTypes = SettingDataService.getMetaTypes();
        this._isPublicTypes = SettingDataService.getIsPublicTypes();

        this._form.valueChanges
            .subscribe(data => this.onValueChanged(data));

    }

    private _setFormErrors(errorFields:any):void{
        for (let key in errorFields) {
            let errorField = errorFields[key];
            // skip loop if the property is from prototype
            if (!this._formErrors.hasOwnProperty(key)) continue;

            // let message = errorFields[error.field];
            this._formErrors[key].valid = false;
            this._formErrors[key].message = errorField;
        }
    }

    private _resetFormErrors():void{
        this._formErrors = {
            meta_key: {valid: true, message: ''},
            meta_name: {valid: true, message: ''},
            meta_type: {valid: true, message: ''},
            meta_desc: {valid: true, message: ''},
            meta_attribute: {valid: true, message: ''},
            meta_value: {valid: true, message: ''},
            is_public: {valid: true, message: ''},
        };
    }

    private _isValid(field):boolean {
        let isValid:boolean = false;

        // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
        if(this._form.controls[field].touched == false) {
            isValid = true;
        }
        // If the field is touched and valid value, then it is considered as valid.
        else if(this._form.controls[field].touched == true && this._form.controls[field].valid == true) {
            isValid = true;
        }
        return isValid;
    }

    public onValueChanged(data?: any) {
        if (!this._form) { return; }

        const form = this._form;

        this._selectedMetaType = data.meta_type;

        if(data.meta_attribute != '') {
            try{
                // this._enteredMetaAttributes = JSON.parse(data.meta_attribute);
                if(JSON.parse(data.meta_attribute)){
                    this._enteredMetaAttributes = JSON.parse(data.meta_attribute);
                } else {
                    this._enteredMetaAttributes = {};
                }

            } catch(e) {
                // If exception is occurred, then meta attribute is not valid JSON
                this._enteredMetaAttributes = {};
            }
        }

        for (let field in this._formErrors) {
            // clear previous error message (if any)
            let control = form.get(field);
            if (control && control.dirty) {
                this._formErrors[field].valid = true;
                this._formErrors[field].message = '';
            }
        }
    }

    private _resetSetting(){
        this._setting = new Setting();
        this._setting.meta_key = '';
        this._setting.meta_name = '';
        this._setting.meta_type = 'text';
        this._setting.meta_desc = '';
        this._setting.meta_attribute = '{"list":[{"value":"SAMPLE VALUE 1","label":"SAMPLE LABEL 1"},{"value":"SAMPLE VALUE 2","label":"SAMPLE LABEL 2"}]}';
        this._setting.meta_value = '';
        this._setting.is_public = 0;
    }

    public ngOnInit() {
        this._resetFormErrors();
        this._resetSetting();

        // _route is activated route service. this._route.params is observable.
        // subscribe is method that takes function to retrieve parameters when it is changed.
        this._parameters = this._activatedRoute.params.subscribe(params => {
            // plus(+) is to convert 'id' to number
            if(typeof params['id'] !== "undefined") {
                this._id = Number.parseInt(params['id']);
                this._errorMessage = "";
                this._settingDataService.getSettingById(this._id)
                    .subscribe(
                        setting => {
                            this._setting = setting;
                            this._mode = 'update';

                        },
                        error => {
                            // unauthorized access
                            if(error.status == 401 || error.status == 403) {
                                this._staffService.unauthorizedAccess(error);
                            } else {
                                this._errorMessage = error.data.message;
                            }
                        }
                    );
            } else {
                this._mode = 'create';

            }
        });

    }

    public ngOnDestroy() {
        this._parameters.unsubscribe();
        this._setting = new Setting();
    }

    public onSubmit() {
        this._submitted = true;
        this._resetFormErrors();

        this._setting.meta_value += '';
        if(this._mode == 'create') {
            this._settingDataService.addSetting(this._setting)
                .subscribe(
                    result => {
                        if(result.success) {
                            this._settingDataService.refreshGlobalSettings();
                            this._router.navigate(['/setting', 'global']);
                        } else {
                            this._submitted = false;
                        }
                    },
                    error => {
                        this._submitted = false;
                        // Validation errors
                        if(error.status == 422) {
                            let errorFields = JSON.parse(error.data.message);
                            this._setFormErrors(errorFields);
                            //this._setFormErrors(error.data);
                        }
                        // Unauthorized Access
                        else if(error.status == 401 || error.status == 403) {
                            this._staffService.unauthorizedAccess(error);
                        }
                        // All other errors
                        else {
                            this._errorMessage = error.data.message;
                        }
                    }
                );
        } else if(this._mode == 'update') {
            this._settingDataService.updateSettingById(this._setting)
                .subscribe(
                    result => {
                        if(result.success) {
                            this._settingDataService.refreshGlobalSettings();
                            this._router.navigate(['/setting', 'global']);
                        } else {
                            this._submitted = false;
                        }
                    },
                    error => {
                        this._submitted = false;
                        // Validation errors
                        if(error.status == 422) {
                            let errorFields = JSON.parse(error.data.message);
                            this._setFormErrors(errorFields);
                        }
                        // Unauthorized Access
                        else if(error.status == 401 || error.status == 403) {
                            this._staffService.unauthorizedAccess(error);
                        }
                        // All other errors
                        else {
                            this._errorMessage = error.data.message;
                        }
                    }
                );
        }
    }
}

function validateMetaValue(metaTypeKey: string, metaAttributeKey:string, metaValueKey:string) {
    return (group: FormGroup) => {
        let metaType = group.controls[metaTypeKey];
        let metaAttribute = group.controls[metaAttributeKey];
        let metaValue = group.controls[metaValueKey];

        let hasError:boolean = false;
        switch(metaType.value) {
            case 'select':

                let enteredMetaAttribute = {
                    'list':  [],
                };

                try{
                    // this._enteredMetaAttributes = JSON.parse(data.meta_attribute);
                    if(JSON.parse(metaAttribute.value)){
                        enteredMetaAttribute = JSON.parse(metaAttribute.value);
                    }
                } catch(e) {
                    // If exception is occurred, then meta attribute is not valid JSON
                }


                hasError = true;
                if(typeof enteredMetaAttribute.list !== "undefined" && enteredMetaAttribute.list.length > 0) {
                    for(let i = 0; i < enteredMetaAttribute.list.length; i++) {
                        if(enteredMetaAttribute.list[i].value == metaValue.value) {
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

        if(hasError == true) {
            return metaValue.setErrors({validateMetaValue: true});
        }

    };

}