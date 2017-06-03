import {NgModule} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';

import {AccountComponent} from './account.component';
import {AccountEditComponent} from './account-edit.component';

const routes: Routes = [
    {
        path: '',

        data: {
            title: 'Account'
        },
        children: [
            {
                path: 'edit',
                component: AccountEditComponent,
                data: {
                    title: 'Update information'
                }
            },
            {
                path: '',
                pathMatch: 'full',
                component: AccountComponent,
                data: {
                    title: 'Account'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule {
}
