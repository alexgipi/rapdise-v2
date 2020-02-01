// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateSharedModule } from '../translate-shared.module';
import { AppMaterialModule } from '../app-material.module';

import { ImageCropperModule } from 'ngx-image-cropper';

import { MomentModule } from 'angular2-moment';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
 
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

//Scrolling Module
import { ScrollingModule } from '@angular/cdk/scrolling';

import { ModalsModule } from '../modals/modals.module';
import { ReproductoresModule } from '../reproductores/reproductores.module';

//Rutas
import { BeatsRoutingModule } from './beats-routing.module';

//PIPES
import { PipesModule } from '../pipes/pipes.module';


// Componentes
//BEATS
import { MainComponent } from './components/main/main.component';
import { MenuBibliotecaComponent } from './components/menu-biblioteca/menu-biblioteca.component';
import { BeatsComponent } from './components/beats/beats.component';
import { ListasBeatsComponent } from './components/listas-beats/listas-beats.component';
import { ListasBeatsUsuarioComponent } from './components/listas-beats-usuario/listas-beats-usuario.component';
import { BeatAddComponent } from './components/beat-add/beat-add.component';
import { BeatEditComponent } from './components/beat-edit/beat-edit.component';
import { ListadoBeatsSubidosComponent } from './components/listado-beats-subidos/listado-beats-subidos.component';
import { BeatsEstiloComponent } from './components/beats-estilo/beats-estilo.component';
import { BeatsUsuarioComponent } from './components/beats-usuario/beats-usuario.component';
import { BeatsFavoritosComponent } from './components/beats-favoritos/beats-favoritos.component';
import { ListadoBeatsFavoritosComponent } from './components/listado-beats-favoritos/listado-beats-favoritos.component';
import { BeatsProductoresComponent } from './components/beats-productores/beats-productores.component';


@NgModule({
  declarations: [
    MainComponent,
    MenuBibliotecaComponent,
    BeatsComponent,
    ListasBeatsComponent,
    ListasBeatsUsuarioComponent,
    BeatAddComponent,
    BeatEditComponent,
    ListadoBeatsSubidosComponent,
    BeatsEstiloComponent,
    BeatsFavoritosComponent,
    BeatsUsuarioComponent,
    ListadoBeatsFavoritosComponent,
    BeatsProductoresComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    BeatsRoutingModule,
    MomentModule,
    PerfectScrollbarModule,
    TagInputModule, 
    BrowserAnimationsModule,
    ImageCropperModule,
    ScrollingModule,
    ModalsModule,
    ReproductoresModule,
    TranslateSharedModule,
    AppMaterialModule
  ],
  exports: [
    MainComponent,
    MenuBibliotecaComponent,
    BeatsComponent,
    ListasBeatsComponent,
    ListasBeatsUsuarioComponent,
    BeatAddComponent,
    BeatEditComponent,
    BeatsEstiloComponent,
    ListadoBeatsSubidosComponent,
    BeatsFavoritosComponent,
    BeatsUsuarioComponent,
    ListadoBeatsFavoritosComponent,
    BeatsProductoresComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class BeatsModule{}
