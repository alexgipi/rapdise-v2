import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';

//Rutas
import { ChatGeneralRoutingModule } from './chat-general-routing.module';

// Componentes
import { MainComponent } from './components/main/main.component';
import { InicioComponent } from './components/inicio/inicio.component';

@NgModule({
  declarations: [
    MainComponent,
    InicioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    ChatGeneralRoutingModule
  ],
  exports: [
    MainComponent,
    InicioComponent
  ],
  providers: []
})
export class ChatGeneralModule{}
