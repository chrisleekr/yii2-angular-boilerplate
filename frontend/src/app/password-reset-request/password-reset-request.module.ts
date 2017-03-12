import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {PasswordResetRequestComponent} from './password-reset-request.component';
import {PasswordResetRequestRoutingModule} from './password-reset-request-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PasswordResetRequestRoutingModule
    ],
    declarations: [
        PasswordResetRequestComponent,
    ]
})
export class PasswordResetRequestModule {
}
