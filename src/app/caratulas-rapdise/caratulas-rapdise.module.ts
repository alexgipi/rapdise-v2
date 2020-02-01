// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CrearCaratulaBibliotecaComponent} from './components/crear-caratula-biblioteca/crear-caratula-biblioteca.component';
import {EditarCaratulaBibliotecaComponent} from './components/editar-caratula-biblioteca/editar-caratula-biblioteca.component';
import {CaratulaBibliotecaComponent} from './components/caratula-biblioteca/caratula-biblioteca.component';

import {AppMaterialModule} from '../app-material.module';

//Rutas


@NgModule({
  declarations: [
    CrearCaratulaBibliotecaComponent,
    EditarCaratulaBibliotecaComponent,
    CaratulaBibliotecaComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule

  ],
  exports: [
    CrearCaratulaBibliotecaComponent,
    EditarCaratulaBibliotecaComponent,
    CaratulaBibliotecaComponent
  ],
  providers: []
})
export class CaratulasRapdiseModule{}
