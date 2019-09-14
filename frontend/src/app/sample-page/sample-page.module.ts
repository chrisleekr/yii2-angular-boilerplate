import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SamplePageRoutingModule } from './sample-page-routing.module';
import { SamplePageComponent } from './sample-page.component';

@NgModule({
  imports: [CommonModule, SharedModule, SamplePageRoutingModule],
  declarations: [SamplePageComponent]
})
export class SamplePageModule {}
