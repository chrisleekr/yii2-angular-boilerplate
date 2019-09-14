import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { UserFormComponent } from './user-form.component';
import { UserListComponent } from './user-list.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, UserRoutingModule],
  declarations: [UserListComponent, UserFormComponent]
})
export class UserModule {}
