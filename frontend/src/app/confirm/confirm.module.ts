import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ConfirmComponent } from './confirm.component';
import { ConfirmRoutingModule } from './confirm-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, ConfirmRoutingModule],
  declarations: [ConfirmComponent]
})
export class ConfirmModule {}
