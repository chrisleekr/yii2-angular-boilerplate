import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ConfirmComponent} from './confirm.component';
import {ConfirmRoutingModule} from './confirm-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ConfirmRoutingModule
    ],
    declarations: [
        ConfirmComponent,
    ]
})
export class ConfirmModule {
}
