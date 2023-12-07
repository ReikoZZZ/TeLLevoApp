import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjustePage } from './ajuste.page';

const routes: Routes = [
  {
    path: '',
    component: AjustePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjustePageRoutingModule {}
