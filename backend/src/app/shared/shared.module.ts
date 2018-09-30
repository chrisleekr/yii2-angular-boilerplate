import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MomentModule} from 'ngx-moment';
import {SpinnerComponent} from './spinner/spinner.component';
import {OWL_DATE_TIME_FORMATS, OwlDateTimeModule} from 'ng-pick-datetime';
import {OwlMomentDateTimeModule} from 'ng-pick-datetime-moment';
import {environment} from '../../environments/environment';
import {PaginationModule} from 'ngx-bootstrap/pagination';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const CUSTOM_DATETIME_FORMATS = environment.customDateTimeFormat;

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        OwlDateTimeModule, OwlMomentDateTimeModule,
        PaginationModule.forRoot(),
    ],
    declarations: [
        SpinnerComponent,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        SpinnerComponent,
        OwlDateTimeModule, OwlMomentDateTimeModule,
        PaginationModule,
    ],
    providers: [
        {provide: OWL_DATE_TIME_FORMATS, useValue: CUSTOM_DATETIME_FORMATS},
    ],
})
export class SharedModule {
}
