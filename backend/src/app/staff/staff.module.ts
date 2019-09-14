import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { StaffFormComponent } from './staff-form.component';
import { StaffListComponent } from './staff-list.component';
import { StaffRoutingModule } from './staff-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, StaffRoutingModule],
  declarations: [StaffListComponent, StaffFormComponent]
})
export class StaffModule {}
