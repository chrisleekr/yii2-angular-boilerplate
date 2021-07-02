import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './model/auth.guard';

import { FrontendLayoutComponent } from './layout/frontend-layout.component';
import { P404Component } from './page/404.component';

export const routes: Routes = [
  {
    path: '',
    component: FrontendLayoutComponent,
    pathMatch: 'full',
    loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
  },
  {
    path: '',
    component: FrontendLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
      }
    ]
  },
  {
    path: '',
    component: FrontendLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'logout',
        loadChildren: () => import('./logout/logout.module').then(m => m.LogoutModule)
      },
      {
        path: 'signup',
        loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule)
      },
      {
        path: 'confirm',
        loadChildren: () => import('./confirm/confirm.module').then(m => m.ConfirmModule)
      },
      {
        path: 'password-reset-request',
        loadChildren: () =>
          import('./password-reset-request/password-reset-request.module').then(m => m.PasswordResetRequestModule)
      },
      {
        path: 'password-reset',
        loadChildren: () => import('./password-reset/password-reset.module').then(m => m.PasswordResetModule)
      },
      {
        path: 'sample-page',
        loadChildren: () => import('./sample-page/sample-page.module').then(m => m.SamplePageModule)
      }
    ]
  },
  // otherwise redirect to home
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
