import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
// Routing Module
import { AppRoutingModule } from './app-routing.module';
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
// 3rd Party
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LOCAL_STORAGE, NgtUniversalModule } from '@ng-toolkit/universal';

export function jwtOptionsFactory(localStorage) {
  return {
    tokenGetter: () => {
      return localStorage.getItem(environment.tokenName) || '';
    }
  };
}

@NgModule({
  declarations: [AppComponent, FrontendLayoutComponent, P404Component],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
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
    UserDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
