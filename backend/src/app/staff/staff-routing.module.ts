import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {StaffListComponent} from './staff-list.component';
import {StaffFormComponent} from './staff-form.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Staffs'
        },
        children: [
            {
                path: 'list',
                component: StaffListComponent,
                data: {
                    title: 'List',
                }
            },
            {
                path: 'create',
                component: StaffFormComponent,
                data: {
                    title: 'Create'
                }
            },
            {
                path: ':id',
                component: StaffFormComponent,
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
export class StaffRoutingModule {}
