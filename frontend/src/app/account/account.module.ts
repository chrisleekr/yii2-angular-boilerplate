import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AccountComponent} from './account.component';
import {AccountEditComponent} from './account-edit.component';
import {AccountRoutingModule} from './account-routing.module';

import {MomentModule} from 'angular2-moment';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AccountRoutingModule,
        MomentModule,
    ],
    declarations: [
        AccountComponent,
        AccountEditComponent,
    ]
})
export class AccountModule {
}
