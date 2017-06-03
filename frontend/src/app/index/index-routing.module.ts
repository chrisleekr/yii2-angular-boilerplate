import { NgModule } from '@angular/core';
import { Routes,
    RouterModule } from '@angular/router';

import { IndexComponent } from './index.component';

const routes: Routes = [
    {
        path: '',
        component: IndexComponent,
        data: {
            title: 'Main Page'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndexRoutingModule {}
