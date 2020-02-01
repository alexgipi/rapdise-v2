// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// import { HttpClientModule } from '@angular/common/http';
// import { routing, appRoutingProviders } from './app.routing';
// import { MomentModule } from 'angular2-moment';

//Rutas
import { EntrenoRoutingModule } from './entreno-routing.module';

import { ReproductoresModule } from '../reproductores/reproductores.module';

// Componentes
import { MainComponent } from './components/main/main.component';
import { PorPalabrasComponent } from './components/por-palabras/por-palabras.component';
import { PorImagenComponent } from './components/por-imagen/por-imagen.component';

import { PorProfesionesComponent } from './components/por-profesiones/por-profesiones.component';

@NgModule({
  declarations: [
    MainComponent,
    PorPalabrasComponent,
    PorImagenComponent,
    PorProfesionesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EntrenoRoutingModule,
    ReproductoresModule
  ],
  exports: [
    MainComponent,
    PorPalabrasComponent,
    PorImagenComponent,
    PorProfesionesComponent
  ],
  providers: []
})
export class EntrenoModule{}
