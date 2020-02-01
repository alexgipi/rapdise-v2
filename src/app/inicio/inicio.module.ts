// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';


import { MuroModule } from '../muro/muro.module';
import { ModalsModule } from '../modals/modals.module';
import { CarruselsModule } from '../carrusels/carrusels.module';
import { ReproductoresModule } from '../reproductores/reproductores.module';

import {AppMaterialModule} from '../app-material.module';

//Rutas
import { InicioRoutingModule } from './inicio-routing.module';


// Componentes
import { InicioNoLoginComponent } from './components/inicio-no-login/inicio-no-login.component';

import { InicioLogueadoComponent } from './components/inicio-logueado/inicio-logueado.component';


@NgModule({
  declarations: [
    InicioNoLoginComponent,
    InicioLogueadoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InicioRoutingModule,
    AppMaterialModule,
    MomentModule,
    MuroModule,
    CarruselsModule,
    ModalsModule,
    ReproductoresModule

  ],
  exports: [
    InicioNoLoginComponent,
    InicioLogueadoComponent
  ],
  providers: []
})
export class InicioModule{}
