import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
// 3rd Party
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { environment } from './../environments/environment';
import { AppComponent } from './app.component';
// Routing Module
import { AppRoutingModule } from './app.routing';
// Layouts
import { BackendLayoutComponent } from './layout/backend-layout.component';
import { SimpleLayoutComponent } from './layout/simple-layout.component';
// Shared
import { AuthGuard } from './model/auth.guard';
// Model & Services
import { GlobalService } from './model/global.service';
import { SettingDataService } from './model/setting-data.service';
import { StaffDataService } from './model/staff-data.service';
import { StaffService } from './model/staff.service';
import { UserDataService } from './model/user-data.service';
import { P404Component } from './page/404.component';
import { SharedModule } from './shared/shared.module';

export function tokenGetter() {
  return localStorage.getItem(environment.tokenName);
}

@NgModule({
  declarations: [AppComponent, BackendLayoutComponent, SimpleLayoutComponent, P404Component],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    })
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    AuthGuard,
    StaffService,
    StaffDataService,
    GlobalService,
    SettingDataService,
    UserDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
