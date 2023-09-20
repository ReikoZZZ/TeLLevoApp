import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioPage } from './formulario.page'; // Asegúrate de que la importación sea correcta

const routes: Routes = [
  {
    path: '',
    component: FormularioPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioPageRoutingModule {}
