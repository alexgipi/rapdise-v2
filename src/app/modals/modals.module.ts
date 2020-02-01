// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


//MODULOS




// Componentes
import { ModalCrearListaComponent } from './components/modal-crear-lista/modal-crear-lista.component';
import { ModalEditarListaComponent } from './components/modal-editar-lista/modal-editar-lista.component';
import { ModalCompartirComponent } from './components/modal-compartir/modal-compartir.component';
import { ModalResponderBatallaComponent } from './components/modal-responder-batalla/modal-responder-batalla.component';
import { ModalResponderBatallaEnProcesoComponent } from './components/modal-responder-batalla-en-proceso/modal-responder-batalla-en-proceso.component';
import { ModalLoginParaAccionComponent } from './components/modal-login-para-accion/modal-login-para-accion.component';

@NgModule({
  declarations: [
    ModalCrearListaComponent,
    ModalEditarListaComponent,
    ModalCompartirComponent,
    ModalResponderBatallaComponent,
    ModalResponderBatallaEnProcesoComponent,
    ModalLoginParaAccionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    ModalCrearListaComponent,
    ModalEditarListaComponent,
    ModalCompartirComponent,
    ModalResponderBatallaComponent,
    ModalResponderBatallaEnProcesoComponent,
    ModalLoginParaAccionComponent
  ],
  providers: []
})
export class ModalsModule{}
