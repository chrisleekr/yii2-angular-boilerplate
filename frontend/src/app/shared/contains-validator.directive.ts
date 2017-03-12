import {Directive, forwardRef, Input, OnInit, OnChanges, SimpleChanges, NgModule} from '@angular/core';
import {NG_VALIDATORS, Validator, AbstractControl, ValidatorFn, Validators} from '@angular/forms';

@Directive({
    selector: '[contains][formControlName],[contains][formControl],[contains][ngModel]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => ContainsValidator),
        multi: true
    }]
})
export class ContainsValidator implements Validator, OnInit, OnChanges {
    @Input() listValues: any;

    private validator: ValidatorFn;
    private onChange: () => void;

    ngOnInit() {
        this.validator = contains(this.listValues);
    }

    ngOnChanges(changes: SimpleChanges){
        for (let key in changes) {
            if(key == 'contains') {
                this.validator = contains(changes[key].currentValue);
                if(this.onChange) this.onChange();
            }
        }
    }

    validate(c: AbstractControl): {[key: string]: any} {
        return this.validator(c);
    }

    registerOnValidatorChange(fn: () => void): void {
        this.onChange = fn;
    }
}

export const contains = (listValues?:any): ValidatorFn => {
    return (control: AbstractControl): {[key: string]: boolean} => {
        if(isPresent(Validators.required(control))) return null;

        let v:string = control.value+"";

        return listValues.indexOf(v) >= 0 ? null : {contains: true};

    }

};

function isPresent(obj) {
    return obj !== undefined && obj !== null;
}





export const ContainsValidators:any = {
    contains,
};

@NgModule({
    declarations: [ContainsValidators],
    exports: [ContainsValidator]
})
export class ContainsModule {
}
