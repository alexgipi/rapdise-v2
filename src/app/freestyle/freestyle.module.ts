// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';
import { Ng5SliderModule } from 'ng5-slider';

// import { HttpClientModule } from '@angular/common/http';
// import { routing, appRoutingProviders } from './app.routing';
// import { MomentModule } from 'angular2-moment';

import { ReproductoresModule } from '../reproductores/reproductores.module';

//Rutas
import { ImprosRoutingModule } from './freestyle-routing.module';

// Componentes
import { MainComponent } from './components/main/main.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { FreestylesComponent } from './components/freestyles/freestyles.component';
import { MisFreestylesComponent } from './components/mis-freestyles/mis-freestyles.component';
import { GrabadoraFreePalabrasComponent } from './components/grabadora-free-palabras/grabadora-free-palabras.component';



import { EditarGrabacionComponent } from './components/editar-grabacion/editar-grabacion.component';

@NgModule({
  declarations: [
    MainComponent,
    InicioComponent,
    FreestylesComponent,
    MisFreestylesComponent,
    GrabadoraFreePalabrasComponent,
    EditarGrabacionComponent 
  ],
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    Ng5SliderModule,
    ImprosRoutingModule,
    ReproductoresModule

  ],
  exports: [
    MainComponent,
    InicioComponent,
    FreestylesComponent,
    MisFreestylesComponent,
    GrabadoraFreePalabrasComponent,
    EditarGrabacionComponent 
  ],
  providers: []
})
export class FreestyleModule{}
