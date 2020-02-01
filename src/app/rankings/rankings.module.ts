// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateSharedModule } from '../translate-shared.module';
import { AppMaterialModule } from '../app-material.module';

// import { HttpClientModule } from '@angular/common/http';
// import { routing, appRoutingProviders } from './app.routing';
// import { MomentModule } from 'angular2-moment';
//Scrolling Module
import { ScrollingModule } from '@angular/cdk/scrolling';

//Rutas
import { RankingsRoutingModule } from './rankings-routing.module';

// Componentes
import { MainComponent } from './components/main/main.component';
import { RankingGeneralComponent } from './components/ranking-general/ranking-general.component';
import { RankingFreestyleComponent } from './components/ranking-freestyle/ranking-freestyle.component';
import { RankingBatallasComponent } from './components/ranking-batallas/ranking-batallas.component';
import { RankingBeatsComponent } from './components/ranking-beats/ranking-beats.component';
import { RankingTemasComponent } from './components/ranking-temas/ranking-temas.component';

import { AppModule } from '../app.module';

@NgModule({
  declarations: [
    MainComponent,
    RankingGeneralComponent,
    RankingFreestyleComponent,
    RankingBatallasComponent,
    RankingBeatsComponent,
    RankingTemasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RankingsRoutingModule,
    ScrollingModule,
    AppMaterialModule
  ],
  exports: [
    MainComponent,
    RankingGeneralComponent,
    RankingFreestyleComponent,
    RankingBatallasComponent,
    RankingBeatsComponent,
    RankingTemasComponent
  ],
  providers: []
})
export class RankingsModule{}
