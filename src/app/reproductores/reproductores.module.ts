// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateSharedModule } from '../translate-shared.module';

//PIPES
import { PipesModule } from '../pipes/pipes.module';

import { AdminBotonesModule } from '../admin-botones/admin-botones.module';

import { CaratulasRapdiseModule } from '../caratulas-rapdise/caratulas-rapdise.module';

//Scrolling Module
import { ScrollingModule } from '@angular/cdk/scrolling';

// Componentes
import { ReproductorGeneralBeatsComponent } from './components/reproductor-general-beats/reproductor-general-beats.component';
import { ReproductorBibliotecaComponent } from './components/reproductor-biblioteca/reproductor-biblioteca.component';
import { ReproductorBibliotecaConListadoComponent } from './components/reproductor-biblioteca-con-listado/reproductor-biblioteca-con-listado.component';
import {SeleccionBeatsBatallaComponent} from './components/seleccion-beats-batalla/seleccion-beats-batalla.component';
import {ReproductorAddBeatComponent} from './components/reproductor-add-beat/reproductor-add-beat.component';

import {BarraReproductorGeneralComponent} from './components/barra-reproductor-general/barra-reproductor-general.component';

import { AppMaterialModule } from '../app-material.module'


@NgModule({
  declarations: [
    ReproductorGeneralBeatsComponent,
    ReproductorBibliotecaComponent,
    ReproductorBibliotecaConListadoComponent,
    SeleccionBeatsBatallaComponent,
    ReproductorAddBeatComponent,
    BarraReproductorGeneralComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    PipesModule,
    AdminBotonesModule,
    CaratulasRapdiseModule,
    TranslateSharedModule,
    AppMaterialModule
  ],
  exports: [
    ReproductorGeneralBeatsComponent,
    ReproductorBibliotecaComponent,
    ReproductorBibliotecaConListadoComponent,
    SeleccionBeatsBatallaComponent,
    ReproductorAddBeatComponent,
    BarraReproductorGeneralComponent
  ],
  providers: []
})
export class ReproductoresModule{}
