import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SignupComponent} from './signup.component';
import {SignupRoutingModule} from './signup-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SignupRoutingModule
    ],
    declarations: [
        SignupComponent,
    ]
})
export class SignupModule {
}
