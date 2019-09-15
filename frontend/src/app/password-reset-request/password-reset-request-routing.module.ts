import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PasswordResetRequestComponent } from './password-reset-request.component';

const routes: Routes = [
  {
    path: '',
    component: PasswordResetRequestComponent,
    data: {
      title: 'Password Reset Request'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordResetRequestRoutingModule {}
