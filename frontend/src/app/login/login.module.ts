import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, LoginRoutingModule],
  declarations: [LoginComponent]
})
export class LoginModule {}
