import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {PasswordResetComponent} from './password-reset.component';
import {PasswordResetRoutingModule} from './password-reset-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PasswordResetRoutingModule
    ],
    declarations: [
        PasswordResetComponent,
    ]
})
export class PasswordResetModule {
}
