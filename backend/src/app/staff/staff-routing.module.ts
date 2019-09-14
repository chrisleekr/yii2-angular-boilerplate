import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StaffFormComponent } from './staff-form.component';
import { StaffListComponent } from './staff-list.component';

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
          title: 'List'
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
