import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';

import {UserListComponent} from './user-list.component';
import {UserFormComponent} from './user-form.component';
import {UserRoutingModule} from './user-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        UserRoutingModule,
    ],
    declarations: [
        UserListComponent,
        UserFormComponent,
    ]
})
export class UserModule { }
