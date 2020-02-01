import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { HttpClientModule, HttpClient } from '@angular/common/http';
import { routing, appRoutingProviders } from './app.routing';
import { FormsModule } from '@angular/forms';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
 
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
 
}

import { AppComponent } from './app.component';

import {PipesModule} from './pipes/pipes.module';

import { AudioContextModule } from 'angular-audio-context';

//MODULOS
import { ReproductoresModule } from './reproductores/reproductores.module';
import { InicioModule } from './inicio/inicio.module';
import { RegistroModule } from './registro/registro.module';

import { ChatModule } from './chat/chat.module';
import { ChatGeneralModule } from './chat-general/chat-general.module';

import { BeatsModule } from './beats/beats.module';
import { EntrenoModule } from './entreno/entreno.module';
import { RankingsModule } from './rankings/rankings.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material.module'




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    routing,
    HttpClientModule,
    PipesModule,
    RegistroModule,
    ChatModule,
    ChatGeneralModule,
    ReproductoresModule,
    InicioModule,
    BeatsModule,
    EntrenoModule,
    RankingsModule, 
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
    }),
    AudioContextModule.forRoot('balanced')
  ],
  providers: [
    appRoutingProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
