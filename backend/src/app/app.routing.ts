import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './model/auth.guard';

import { BackendLayoutComponent } from './layout/backend-layout.component';
import { SimpleLayoutComponent } from './layout/simple-layout.component';
import { P404Component } from './page/404.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: BackendLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'staff',
        loadChildren: 'app/staff/staff.module#StaffModule'
      },
      {
        path: 'user',
        loadChildren: 'app/user/user.module#UserModule'
      },
      {
        path: 'setting',
        loadChildren: 'app/setting/setting.module#SettingModule'
      }
    ]
  },
  {
    path: '',
    component: SimpleLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: 'app/login/login.module#LoginModule'
      },
      {
        path: 'logout',
        loadChildren: 'app/logout/logout.module#LogoutModule'
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
