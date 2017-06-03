import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';


import {FormsModule, ReactiveFormsModule}        from '@angular/forms';
import {MomentModule} from 'angular2-moment';
import {LimitToPipe} from './limit-to.pipe';
import {Nl2BrPipe} from './nl2br.pipe';
import {KeysPipe} from './keys.pipe';
import {ContainsValidator} from './contains-validator.directive';
import {AuthModule} from './auth.module';
import {TimepickerComponent} from './timepicker/timepicker.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthModule,
        MomentModule,
    ],
    declarations: [
        LimitToPipe,
        Nl2BrPipe,
        KeysPipe,
        ContainsValidator,
        TimepickerComponent,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        LimitToPipe,
        Nl2BrPipe,
        KeysPipe,
        ContainsValidator,
        TimepickerComponent,
    ],
    providers: []
})
export class SharedModule {
}