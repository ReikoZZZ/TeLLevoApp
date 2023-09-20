import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterfazChoferPage } from './interfaz-chofer.page';

const routes: Routes = [
  {
    path: '',
    component: InterfazChoferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterfazChoferPageRoutingModule {}
