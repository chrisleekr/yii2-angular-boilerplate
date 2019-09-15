import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { AccountComponent } from './account.component';
import { AccountEditComponent } from './account-edit.component';
import { AccountRoutingModule } from './account-routing.module';

import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [CommonModule, SharedModule, AccountRoutingModule, MomentModule],
  declarations: [AccountComponent, AccountEditComponent]
})
export class AccountModule {}
