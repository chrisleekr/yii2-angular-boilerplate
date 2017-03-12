import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {UserListComponent} from './user-list.component';
import {UserFormComponent} from './user-form.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Users'
        },
        children: [
            {
                path: 'list',
                component: UserListComponent,
                data: {
                    title: 'List',
                }
            },
            {
                path: 'create',
                component: UserFormComponent,
                data: {
                    title: 'Create'
                }
            },
            {
                path: ':id',
                component: UserFormComponent,
                data: {
                    title: 'Update'
                }
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {}
