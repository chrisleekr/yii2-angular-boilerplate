import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Layouts
import {FullLayoutComponent} from './layouts/full-layout.component';
import {SimpleLayoutComponent}  from './layouts/simple-layout.component';
import {P404Component} from './pages/404.component';

import {AuthGuard} from './model/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        component: FullLayoutComponent,
        data: {
            title: 'Home'
        },
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
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
        component:SimpleLayoutComponent,
        children: [
            {
                path: 'login',
                loadChildren: 'app/login/login.module#LoginModule'
            },
            {
                path: 'logout',
                loadChildren: 'app/logout/logout.module#LogoutModule'
            },
            {
                path: 'signup',
                loadChildren: 'app/signup/signup.module#SignupModule'
            },
            {
                path: 'confirm',
                loadChildren: 'app/confirm/confirm.module#ConfirmModule'
            },
            {
                path: 'password-reset-request',
                loadChildren: 'app/password-reset-request/password-reset-request.module#PasswordResetRequestModule'
            },
            {
                path: 'password-reset',
                loadChildren: 'app/password-reset/password-reset.module#PasswordResetModule'
            }
        ],
    },
    // otherwise redirect to home
    { path: '**', component: P404Component }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
