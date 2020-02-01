// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { HttpClientModule } from '@angular/common/http';
// import { routing, appRoutingProviders } from './app.routing';
import { MomentModule } from 'angular2-moment';

//Rutas
import { MuroRoutingModule } from './muro.routing.module';

// Componentes
import { MainComponent } from './components/main/main.component';
import {TimelineComponent } from './components/timeline/timeline.component';
import {SidebarComponent } from './components/sidebar/sidebar.component';

import { AppModule } from '../app.module';

@NgModule({
  declarations: [
    MainComponent,
    TimelineComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    MuroRoutingModule,
  ],
  exports: [
    MainComponent,
    TimelineComponent,
    SidebarComponent
  ],
  providers: []
})
export class MuroModule{}
