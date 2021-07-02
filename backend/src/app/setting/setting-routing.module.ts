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
        loadChildren: () => import('./global/setting-global.module').then(m => m.SettingGlobalModule)
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
