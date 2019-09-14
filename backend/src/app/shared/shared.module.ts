import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MomentModule } from 'ngx-moment';
import { environment } from '../../environments/environment';
import { SpinnerComponent } from './spinner/spinner.component';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const CUSTOM_DATETIME_FORMATS = environment.customDateTimeFormat;

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MomentModule,

    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PaginationModule.forRoot()
  ],
  declarations: [SpinnerComponent],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    SpinnerComponent,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PaginationModule
  ],
  providers: []
})
export class SharedModule {}
