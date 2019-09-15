import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index.component';

@NgModule({
  imports: [CommonModule, SharedModule, IndexRoutingModule],
  declarations: [IndexComponent]
})
export class IndexModule {}
