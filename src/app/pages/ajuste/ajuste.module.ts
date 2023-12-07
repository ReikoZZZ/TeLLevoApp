import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjustePageRoutingModule } from './ajuste-routing.module';

import { AjustePage } from './ajuste.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjustePageRoutingModule
  ],
  declarations: [AjustePage]
})
export class AjustePageModule {}
