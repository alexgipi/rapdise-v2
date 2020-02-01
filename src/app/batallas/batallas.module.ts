import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';

import { ModalsModule } from '../modals/modals.module';
import { ReproductoresModule } from '../reproductores/reproductores.module';

//PIPES
import { PipesModule } from '../pipes/pipes.module';

//Rutas
import { BatallasRoutingModule } from './batallas-routing.module';

// Componentes
import { MainComponent } from './components/main/main.component';
import { ListadoBatallasComponent } from './components/listado-batallas/listado-batallas.component';
import { MisBatallasComponent } from './components/mis-batallas/mis-batallas.component';

import { NuevaBatallaComponent } from './components/nueva-batalla/nueva-batalla.component';
import { ResponderBatallaComponent } from './components/responder-batalla/responder-batalla.component';

import { BuscarRivalComponent } from './components/buscar-rival/buscar-rival.component';

import { NuevaBatallaDesafiarComponent } from './components/nueva-batalla-desafiar/nueva-batalla-desafiar.component';

import { BatallaVSComponent } from './components/batalla-vs/batalla-vs.component';

// BATALLAS EN DIRECTO
import { ListadoBatallasDirectoComponent } from './components/listado-batallas-directo/listado-batallas-directo.component';
import { BatallaEnDirectoComponent } from './components/batalla-en-directo/batalla-en-directo.component';
// HACER DE JURADO

//COMENTARIOS BATALLA (componente sin ruta)
import { ComentariosBatallaComponent } from './components/comentarios-batalla/comentarios-batalla.component';

import { ReproductorComponent } from './components/reproductor/reproductor.component';

@NgModule({
  declarations: [
    MainComponent,
    ListadoBatallasComponent,
    MisBatallasComponent,
    NuevaBatallaComponent,
    ResponderBatallaComponent,
    NuevaBatallaDesafiarComponent,
    BatallaVSComponent,
    ComentariosBatallaComponent,
    ListadoBatallasDirectoComponent,
    BatallaEnDirectoComponent,
    BuscarRivalComponent,
    ReproductorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    PipesModule,
    BatallasRoutingModule,
    ModalsModule,
    ReproductoresModule
  ],
  exports: [
    MainComponent,
    ListadoBatallasComponent,
    MisBatallasComponent,
    NuevaBatallaComponent,
    ResponderBatallaComponent,
    NuevaBatallaDesafiarComponent,
    BatallaVSComponent,
    ComentariosBatallaComponent,
    ListadoBatallasDirectoComponent,
    BatallaEnDirectoComponent,
    BuscarRivalComponent,
    ReproductorComponent
  ],
  providers: []
})
export class BatallasModule{}
