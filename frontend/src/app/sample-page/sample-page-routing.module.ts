import {NgModule} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';

import {SamplePageComponent} from './sample-page.component';
import {SamplePageSSEComponent} from './sample-page-sse.component';

const routes: Routes = [
    {
        path: '',

        data: {
            title: 'Sample Page'
        },
        children: [
            {
                path: 'sse-example',
                component: SamplePageSSEComponent,
                data: {
                    title: 'Server Send Event'
                }
            },
            {
                path: ':id',
                component: SamplePageComponent,
                data: {
                    title: 'Sample Page'
                }
            },
            {
                path: '',
                pathMatch: 'full',
                component: SamplePageComponent,
                data: {
                    title: 'Sample Page'
                }
            }
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SamplePageRoutingModule {
}
