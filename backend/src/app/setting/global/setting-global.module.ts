import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { SettingGlobalFormComponent } from './setting-global-form.component';
import { SettingGlobalListComponent } from './setting-global-list.component';
import { SettingGlobalRoutingModule } from './setting-global-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, SettingGlobalRoutingModule],
  declarations: [SettingGlobalListComponent, SettingGlobalFormComponent]
})
export class SettingGlobalModule {}
