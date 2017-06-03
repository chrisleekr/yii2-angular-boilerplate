import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Layouts
import {FrontendLayoutComponent} from './layouts/frontend-layout.component';
import {P404Component} from './pages/404.component';

import {AuthGuard} from './model/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component:FrontendLayoutComponent,
        pathMatch: 'full',
        loadChildren: 'app/index/index.module#IndexModule'
    },
    {
        path: '',
        component: FrontendLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'account',
                loadChildren: 'app/account/account.module#AccountModule'
            }
        ]
    },
    {
        path: '',
        component:FrontendLayoutComponent,
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
            },
            {
                path: 'sample-page',
                loadChildren: 'app/sample-page/sample-page.module#SamplePageModule'
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
