// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { Routes, RouterModule } from '@angular/router';

import { ModalsModule } from '../modals/modals.module';



// Componentes
import { CarruselBatallasComponent } from './components/carrusel-batallas/carrusel-batallas.component';
import { CarruselEsperandoRespuestaComponent } from './components/carrusel-esperando-respuesta/carrusel-esperando-respuesta.component';
import { CarruselBeatsComponent  } from './components/carrusel-beats/carrusel-beats.component';
import { CarruselImprosComponent } from './components/carrusel-impros/carrusel-impros.component';
import { CarruselLosMejoresComponent } from './components/carrusel-los-mejores/carrusel-los-mejores.component';
import { CarruselUsuariosDestacadosComponent } from './components/carrusel-usuarios-destacados/carrusel-usuarios-destacados.component';


@NgModule({
  declarations: [
    CarruselBatallasComponent,
    CarruselEsperandoRespuestaComponent,
    CarruselBeatsComponent,
    CarruselImprosComponent,
    CarruselLosMejoresComponent,
    CarruselUsuariosDestacadosComponent
  ],
  imports: [
    CommonModule,
    MomentModule,
    RouterModule,
    ModalsModule
  ],
  exports: [
    CarruselBatallasComponent,
    CarruselEsperandoRespuestaComponent,
    CarruselBeatsComponent,
    CarruselImprosComponent,
    CarruselLosMejoresComponent,
    CarruselUsuariosDestacadosComponent
  ],
  providers: []
})
export class CarruselsModule{}
