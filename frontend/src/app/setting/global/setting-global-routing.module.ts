import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SettingGlobalListComponent} from './setting-global-list.component';
import {SettingGlobalFormComponent} from './setting-global-form.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Global Settings'
        },
        children: [
            {
                path: 'list',
                component: SettingGlobalListComponent,
                data: {
                    title: 'List',
                }
            },
            {
                path: 'create',
                component: SettingGlobalFormComponent,
                data: {
                    title: 'Create'
                }
            },
            {
                path: ':id',
                component: SettingGlobalFormComponent,
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
export class SettingGlobalRoutingModule {}
