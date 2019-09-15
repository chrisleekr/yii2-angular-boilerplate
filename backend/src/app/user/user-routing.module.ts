import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserFormComponent } from './user-form.component';
import { UserListComponent } from './user-list.component';

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
          title: 'List'
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
