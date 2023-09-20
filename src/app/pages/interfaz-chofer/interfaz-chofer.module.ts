import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterfazChoferPageRoutingModule } from './interfaz-chofer-routing.module';

import { InterfazChoferPage } from './interfaz-chofer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterfazChoferPageRoutingModule
  ],
  declarations: [InterfazChoferPage]
})
export class InterfazChoferPageModule {}
