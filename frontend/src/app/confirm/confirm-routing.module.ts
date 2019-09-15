import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmComponent } from './confirm.component';

const routes: Routes = [
  {
    path: '',
    component: ConfirmComponent,
    data: {
      title: 'Confirm'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmRoutingModule {}
