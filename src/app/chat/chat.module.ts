// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {PanelChatComponent} from './components/panel-chat/panel-chat.component';

import {AppMaterialModule} from '../app-material.module';

import { ChatService } from '../services/chat.service';

//Rutas


@NgModule({
  declarations: [
    PanelChatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppMaterialModule

  ],
  exports: [
    PanelChatComponent
  ],
  providers: [ChatService]
})
export class ChatModule{}
