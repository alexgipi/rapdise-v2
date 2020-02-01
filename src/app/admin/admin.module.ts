// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// import { HttpClientModule } from '@angular/common/http';
// import { routing, appRoutingProviders } from './app.routing';
// import { MomentModule } from 'angular2-moment';

//Rutas
import { AdminRoutingModule } from './admin.routing.module';

// Componentes
import { MainComponent } from './components/main/main.component';
import { ImagenesComponent } from './components/imagenes/imagenes.component';
import { PalabrasComponent } from './components/palabras/palabras.component';

@NgModule({
  declarations: [
    MainComponent,
    ImagenesComponent,
    PalabrasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
  ],
  exports: [
    MainComponent
  ],
  providers: []
})
export class AdminModule{}
