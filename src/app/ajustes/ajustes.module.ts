// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// import { HttpClientModule } from '@angular/common/http';
// import { routing, appRoutingProviders } from './app.routing';
// import { MomentModule } from 'angular2-moment';

//Rutas
import { AjustesRoutingModule } from './ajustes.routing.module';

// Componentes
import { MainComponent } from './components/main/main.component';
import { InformacionPersonalComponent } from './components/informacion-personal/informacion-personal.component';

import { AppModule } from '../app.module';

@NgModule({
  declarations: [
    MainComponent,
    InformacionPersonalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AjustesRoutingModule,
  ],
  exports: [
    MainComponent,
    InformacionPersonalComponent
  ],
  providers: []
})
export class AjustesModule{}
