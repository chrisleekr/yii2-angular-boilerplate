import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SamplePageComponent } from './sample-page.component';

const routes: Routes = [
  {
    path: '',

    data: {
      title: 'Sample Page'
    },
    children: [
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SamplePageRoutingModule {}
