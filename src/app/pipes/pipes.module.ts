// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FiltroBatallasPipe } from './filtro-batallas/filtro-batallas.pipe';
import { FiltroBatallasBusquedaPipe } from './filtro-batallas-busqueda/filtro-batallas-busqueda.pipe';
import { FiltroBeatsPipe } from './filtro-beats/filtro-beats.pipe';


@NgModule({
  declarations: [
    FiltroBatallasPipe,
    FiltroBeatsPipe,
    FiltroBatallasBusquedaPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FiltroBatallasPipe,
    FiltroBeatsPipe,
    FiltroBatallasBusquedaPipe
  ],
  providers: []
})
export class PipesModule{}
