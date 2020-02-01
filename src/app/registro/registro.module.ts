// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// import { HttpClientModule } from '@angular/common/http';
// import { routing, appRoutingProviders } from './app.routing';
// import { MomentModule } from 'angular2-moment';

//Rutas
import { RegistroRoutingModule } from './registro-routing.module';

// Componentes
import { MainComponent } from './components/main/main.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RegistroAjustarPerfilComponent } from './components/registro-ajustar-perfil/registro-ajustar-perfil.component';
import { RegistroFinalizadoComponent } from './components/registro-finalizado/registro-finalizado.component';

import { LoginComponent } from './components/login/login.component';

// AJUSTES PERFIL
import { AppModule } from '../app.module';
import { AjustesModule } from '../ajustes/ajustes.module';

@NgModule({
  declarations: [
    MainComponent,
    RegistroComponent,
    RegistroAjustarPerfilComponent,
    RegistroFinalizadoComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RegistroRoutingModule,
    AjustesModule
  ],
  exports: [
    MainComponent,
    RegistroComponent,
    RegistroAjustarPerfilComponent,
    RegistroFinalizadoComponent,
    LoginComponent
  ],
  providers: []
})
export class RegistroModule{}
