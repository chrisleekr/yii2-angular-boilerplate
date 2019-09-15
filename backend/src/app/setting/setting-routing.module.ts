import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Settings'
    },
    children: [
      {
        path: 'global',
        loadChildren: 'app/setting/global/setting-global.module#SettingGlobalModule'
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'global'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule {}
