import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
// Routing Module
import { AppRoutingModule } from './app.routing';
// Layouts
import { FrontendLayoutComponent } from './layout/frontend-layout.component';
import { P404Component } from './page/404.component';
// Shared
import { AuthGuard } from './model/auth.guard';
import { SharedModule } from './shared/shared.module';
import { environment } from './../environments/environment';
// Model & Services
import { GlobalService } from './model/global.service';
import { UserService } from './model/user.service';
import { UserDataService } from './model/user-data.service';
import { SettingDataService } from './model/setting-data.service';
// 3rd Party
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

export function jwtOptionsFactory(localStorage) {
  return {
    tokenGetter: () => {
      return localStorage.getItem(environment.tokenName) || '';
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    FrontendLayoutComponent,
    P404Component
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    NgtUniversalModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [LOCAL_STORAGE]
      }
    })
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    AuthGuard,
    UserService,
    GlobalService,
    SettingDataService,
    UserDataService
  ],
})
export class AppModule {
}
