import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { PasswordResetComponent } from './password-reset.component';
import { PasswordResetRoutingModule } from './password-reset-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, PasswordResetRoutingModule],
  declarations: [PasswordResetComponent]
})
export class PasswordResetModule {}
